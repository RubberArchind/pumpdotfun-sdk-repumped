import "dotenv/config";
import {
    Connection,
    PublicKey,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { DEFAULT_DECIMALS } from "../src/pumpFun.consts.js";
import { PumpFunSDK } from "../src/index.js";
import {
    getAccount,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
    TOKEN_2022_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    createTransferCheckedInstruction,
} from "@solana/spl-token";
import bs58 from "bs58";

const RPC = process.env.HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com";
const SLIPPAGE_BPS = 500n; // 5% slippage
const PRIORITY = { unitLimit: 250_000, unitPrice: 250_000 };

async function main() {
    // Parse command line arguments
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.error("Usage: bun run example/sellToken.ts <MINT_ADDRESS> <PRIVATE_KEY> [AMOUNT_PERCENT]");
        console.error("\nExamples:");
        console.error("  Sell 100% of tokens:");
        console.error("    bun run example/sellToken.ts 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU your_base58_private_key");
        console.error("\n  Sell 50% of tokens:");
        console.error("    bun run example/sellToken.ts 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU your_base58_private_key 50");
        process.exit(1);
    }

    const mintAddress = args[0];
    const privateKeyStr = args[1];
    const amountPercent = args[2] ? parseFloat(args[2]) : 100;

    if (amountPercent <= 0 || amountPercent > 100) {
        console.error("Error: AMOUNT_PERCENT must be between 0 and 100");
        process.exit(1);
    }

    // Parse private key
    let seller: Keypair;
    try {
        const privateKeyBytes = bs58.decode(privateKeyStr);
        seller = Keypair.fromSecretKey(privateKeyBytes);
    } catch (error) {
        console.error("Error: Invalid private key format. Please provide a base58-encoded private key.");
        process.exit(1);
    }

    // Parse mint address
    let mint: PublicKey;
    try {
        mint = new PublicKey(mintAddress);
    } catch (error) {
        console.error("Error: Invalid mint address");
        process.exit(1);
    }

    console.log("=== Pump.fun Token Sell ===");
    console.log("Mint:", mint.toBase58());
    console.log("Seller:", seller.publicKey.toBase58());
    console.log("Amount:", amountPercent === 100 ? "100% (all tokens)" : `${amountPercent}%`);
    console.log("Slippage:", Number(SLIPPAGE_BPS) / 100, "%");

    // Setup connection and SDK
    const connection = new Connection(RPC, { commitment: "confirmed" });
    const dummyWallet = new Wallet(seller);
    const provider = new AnchorProvider(connection, dummyWallet, {
        commitment: "confirmed",
    });
    const sdk = new PumpFunSDK(provider);

    // Check SOL balance
    const solBalance = await connection.getBalance(seller.publicKey);
    console.log("\nSeller SOL balance:", (solBalance / LAMPORTS_PER_SOL).toFixed(4), "SOL");

    if (solBalance < 0.005 * LAMPORTS_PER_SOL) {
        console.error("Error: Insufficient SOL for transaction fees (need at least 0.005 SOL)");
        process.exit(1);
    }

    // Check if mint is Token2022
    const mintInfo = await connection.getAccountInfo(mint);
    if (!mintInfo) {
        console.error("Error: Mint account not found");
        process.exit(1);
    }

    const isMintToken2022 = mintInfo.owner.equals(TOKEN_2022_PROGRAM_ID);
    if (isMintToken2022) {
        console.log("\n⚠️  This is a Token2022 mint");
    }

    // Get token account and balance
    // Check both legacy and Token2022 ATAs
    const legacyATA = await getAssociatedTokenAddress(
        mint,
        seller.publicKey,
        false,
        TOKEN_PROGRAM_ID
    );
    const token2022ATA = await getAssociatedTokenAddress(
        mint,
        seller.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
    );

    let tokenBalance: bigint = 0n;
    let userATA: PublicKey;
    let isToken2022 = false;

    // Try legacy ATA first
    let legacyBalance = 0n;
    let legacyExists = false;
    try {
        const legacyAccount = await getAccount(
            connection,
            legacyATA,
            "confirmed",
            TOKEN_PROGRAM_ID
        );
        legacyBalance = legacyAccount.amount;
        legacyExists = true;
    } catch (error) {
        // Legacy ATA doesn't exist or is empty
    }

    // Try Token2022 ATA
    let token2022Balance = 0n;
    let token2022Exists = false;
    try {
        const token2022Account = await getAccount(
            connection,
            token2022ATA,
            "confirmed",
            TOKEN_2022_PROGRAM_ID
        );
        token2022Balance = token2022Account.amount;
        token2022Exists = true;
    } catch (error) {
        // Token2022 ATA doesn't exist or is empty
    }

    // Use legacy ATA if it has tokens, otherwise use Token2022
    if (legacyExists && legacyBalance > 0n) {
        userATA = legacyATA;
        tokenBalance = legacyBalance;
        isToken2022 = false;
        console.log("\n✓ Found legacy token account");
    } else if (token2022Exists && token2022Balance > 0n) {
        userATA = token2022ATA;
        tokenBalance = token2022Balance;
        isToken2022 = true;
        console.log("\n✓ Found Token2022 account");
        console.log("   Will use Token2022 ATA for selling");
    } else {
        console.error("\n✗ No token account found (checked both legacy and Token2022)");
        console.error("  Legacy ATA:", legacyATA.toBase58(), "exists:", legacyExists, "balance:", legacyBalance.toString());
        console.error("  Token2022 ATA:", token2022ATA.toBase58(), "exists:", token2022Exists, "balance:", token2022Balance.toString());
        console.error("\nThis wallet has no tokens for this mint.");
        process.exit(1);
    }

    const tokenBalanceDecimal = Number(tokenBalance) / 10 ** DEFAULT_DECIMALS;
    console.log("Token balance:", tokenBalanceDecimal.toFixed(DEFAULT_DECIMALS));

    if (tokenBalance === 0n) {
        console.error("Error: No tokens to sell");
        process.exit(1);
    }

    // Calculate sell amount
    const sellAmount = amountPercent === 100
        ? tokenBalance
        : (tokenBalance * BigInt(Math.floor(amountPercent * 100))) / 10000n;

    const sellAmountDecimal = Number(sellAmount) / 10 ** DEFAULT_DECIMALS;
    console.log("Selling:", sellAmountDecimal.toFixed(DEFAULT_DECIMALS), "tokens");

    // Get bonding curve info
    try {
        const bondingCurve = await sdk.token.getBondingCurveAccount(mint);
        if (!bondingCurve) {
            console.error("Error: Bonding curve not found. Token may have graduated to Raydium.");
            process.exit(1);
        }

        console.log("\nBonding curve status:");
        console.log("  Virtual SOL:", Number(bondingCurve.virtualSolReserves) / LAMPORTS_PER_SOL, "SOL");
        console.log("  Virtual tokens:", Number(bondingCurve.virtualTokenReserves) / 10 ** DEFAULT_DECIMALS);
        console.log("  Real SOL:", Number(bondingCurve.realSolReserves) / LAMPORTS_PER_SOL, "SOL");
        console.log("  Real tokens:", Number(bondingCurve.realTokenReserves) / 10 ** DEFAULT_DECIMALS);

        // Calculate expected SOL output
        const globalAccount = await sdk.token.getGlobalAccount();
        const feeConfig = await sdk.token.getFeeConfig();
        const expectedSol = bondingCurve.getSellPrice(globalAccount, feeConfig, sellAmount);
        console.log("  Expected SOL output:", Number(expectedSol) / LAMPORTS_PER_SOL, "SOL");
    } catch (error) {
        console.error("Warning: Could not fetch bonding curve details:", error);
    }

    // Execute sell
    console.log("\n=== Executing Sell ===");
    try {
        const result = await sdk.trade.sell(
            seller,
            mint,
            sellAmount,
            SLIPPAGE_BPS,
            PRIORITY
        );

        if (result.success) {
            console.log("\n✅ SELL SUCCESSFUL!");
            console.log("Signature:", result.signature);
            console.log("Explorer:", `https://solscan.io/tx/${result.signature}`);

            // Check new balances
            const newSolBalance = await connection.getBalance(seller.publicKey);
            const solReceived = (newSolBalance - solBalance) / LAMPORTS_PER_SOL;
            console.log("\nSOL received:", solReceived.toFixed(6), "SOL");
            console.log("New SOL balance:", (newSolBalance / LAMPORTS_PER_SOL).toFixed(4), "SOL");

            try {
                const newTokenAccount = await getAccount(
                    connection,
                    userATA,
                    "confirmed",
                    TOKEN_PROGRAM_ID
                );
                const newTokenBalance = Number(newTokenAccount.amount) / 10 ** DEFAULT_DECIMALS;
                console.log("Remaining tokens:", newTokenBalance.toFixed(DEFAULT_DECIMALS));
            } catch (error) {
                console.log("Remaining tokens: 0 (account closed)");
            }
        } else {
            console.log("\n❌ SELL FAILED");
            console.log("Result:", result);
        }
    } catch (error: any) {
        console.error("\n❌ SELL ERROR:");
        console.error("Message:", error.message);
        if (error.logs) {
            console.error("\nTransaction logs:");
            error.logs.forEach((log: string) => console.error("  ", log));
        }
        process.exit(1);
    }
}

main().catch((e) => {
    console.error("Script error:", e);
    process.exit(1);
});
