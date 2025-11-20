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
} from "@solana/spl-token";
import bs58 from "bs58";

const RPC = process.env.HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com";
const SLIPPAGE_BPS = 500n; // 5% slippage
const PRIORITY = { unitLimit: 250_000, unitPrice: 250_000 };

async function main() {
    // Parse command line arguments
    const args = process.argv.slice(2);

    if (args.length < 3) {
        console.error("Usage: bun run example/buyToken2022.ts <MINT_ADDRESS> <PRIVATE_KEY> <SOL_AMOUNT>");
        console.error("\nExample:");
        console.error("  bun run example/buyToken2022.ts 4JN5guh15dfPxoBe6KgsipAnKJC3zLgj6VJ1us4Dpump your_base58_private_key 0.1");
        process.exit(1);
    }

    const mintAddress = args[0];
    const privateKeyStr = args[1];
    const solAmount = parseFloat(args[2]);

    // Parse private key
    let buyer: Keypair;
    try {
        const privateKeyBytes = bs58.decode(privateKeyStr);
        buyer = Keypair.fromSecretKey(privateKeyBytes);
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

    if (solAmount <= 0) {
        console.error("Error: SOL_AMOUNT must be greater than 0");
        process.exit(1);
    }

    console.log("=== Pump.fun Token2022 Buy ===");
    console.log("Mint:", mint.toBase58());
    console.log("Buyer:", buyer.publicKey.toBase58());
    console.log("SOL to spend:", solAmount, "SOL");
    console.log("Slippage:", Number(SLIPPAGE_BPS) / 100, "%");

    // Setup connection and SDK
    const connection = new Connection(RPC, { commitment: "confirmed" });
    const dummyWallet = new Wallet(buyer);
    const provider = new AnchorProvider(connection, dummyWallet, {
        commitment: "confirmed",
    });
    const sdk = new PumpFunSDK(provider);

    // Check SOL balance
    const solBalance = await connection.getBalance(buyer.publicKey);
    console.log("\nBuyer SOL balance:", (solBalance / LAMPORTS_PER_SOL).toFixed(4), "SOL");

    const solNeeded = solAmount * LAMPORTS_PER_SOL + 0.005 * LAMPORTS_PER_SOL; // add 0.005 for fees
    if (solBalance < solNeeded) {
        console.error("Error: Insufficient SOL (need", (solNeeded / LAMPORTS_PER_SOL).toFixed(4), "SOL)");
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
        console.log("\n✅ This is a Token2022 mint");
    } else {
        console.log("\n⚠️  This is a legacy token (not Token2022)");
    }

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

        // Calculate expected token output
        const globalAccount = await sdk.token.getGlobalAccount();
        const feeConfig = await sdk.token.getFeeConfig();
        const expectedTokens = bondingCurve.getBuyPrice(
            globalAccount,
            feeConfig,
            BigInt(Math.floor(solAmount * LAMPORTS_PER_SOL))
        );
        console.log("  Expected tokens from", solAmount, "SOL:", Number(expectedTokens) / 10 ** DEFAULT_DECIMALS);
    } catch (error) {
        console.error("Warning: Could not fetch bonding curve details:", error);
    }

    // Execute buy
    console.log("\n=== Executing Buy ===");
    try {
        const result = await sdk.trade.buy(
            buyer,
            mint,
            BigInt(Math.floor(solAmount * LAMPORTS_PER_SOL)),
            SLIPPAGE_BPS,
            PRIORITY
        );

        if (result.success) {
            console.log("\n✅ BUY SUCCESSFUL!");
            console.log("Signature:", result.signature);
            console.log("Explorer:", `https://solscan.io/tx/${result.signature}`);

            // Check new balances
            const newSolBalance = await connection.getBalance(buyer.publicKey);
            const solSpent = (solBalance - newSolBalance) / LAMPORTS_PER_SOL;
            console.log("\nSOL spent:", solSpent.toFixed(6), "SOL");
            console.log("New SOL balance:", (newSolBalance / LAMPORTS_PER_SOL).toFixed(4), "SOL");

            // Check token balance
            const tokenProgram = isMintToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;
            const tokenATA = await getAssociatedTokenAddress(
                mint,
                buyer.publicKey,
                false,
                tokenProgram
            );

            try {
                const tokenAccount = await getAccount(connection, tokenATA, "confirmed", tokenProgram);
                const tokenBalance = Number(tokenAccount.amount) / 10 ** DEFAULT_DECIMALS;
                console.log("Token balance:", tokenBalance.toFixed(DEFAULT_DECIMALS), "tokens");
            } catch (error) {
                console.log("Could not fetch token balance");
            }
        } else {
            console.log("\n❌ BUY FAILED");
            console.log("Result:", result);
        }
    } catch (error: any) {
        console.error("\n❌ BUY ERROR:");
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
