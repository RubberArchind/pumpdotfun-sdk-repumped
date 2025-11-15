import "dotenv/config";
import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { DEFAULT_DECIMALS } from "../src/pumpFun.consts.js";
import { getSPL, wallet } from "./utils.js";
import { PumpFunSDK } from "../src/index.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

const RPC = process.env.HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com";
const SLIPPAGE_BPS = 1000n;
const PRIORITY = { unitLimit: 250_000, unitPrice: 250_000 };

async function main() {
    // Get mint address from command line argument
    const mintAddress = process.argv[2];
    if (!mintAddress) {
        console.error("Usage: bun run example/testSell.ts <MINT_ADDRESS>");
        process.exit(1);
    }

    const mint = new PublicKey(mintAddress);
    const connection = new Connection(RPC, { commitment: "confirmed" });
    const dummyWallet = new Wallet(wallet);
    const provider = new AnchorProvider(connection, dummyWallet, {
        commitment: "confirmed",
    });
    const sdk = new PumpFunSDK(provider);

    console.log("Testing sell for mint:", mint.toBase58());
    console.log("Seller:", wallet.publicKey.toBase58());

    // Check token balance
    const balance = await getSPL(connection, mint, wallet.publicKey);
    console.log("\nUser token balance:", balance / 10 ** DEFAULT_DECIMALS);

    if (balance === 0) {
        console.error("No tokens to sell!");
        process.exit(1);
    }

    // Get bonding curve info
    const bondingCurve = sdk.pda.getBondingCurvePDA(mint);
    console.log("\nBonding curve PDA:", bondingCurve.toBase58());

    // Check what bonding curve ATAs exist
    const legacyBondingATA = await getAssociatedTokenAddress(
        mint,
        bondingCurve,
        true,
        TOKEN_PROGRAM_ID
    );
    const token2022BondingATA = await getAssociatedTokenAddress(
        mint,
        bondingCurve,
        true,
        TOKEN_2022_PROGRAM_ID
    );

    console.log("\nChecking bonding curve ATAs:");
    console.log("Legacy ATA:", legacyBondingATA.toBase58());
    console.log("Token2022 ATA:", token2022BondingATA.toBase58());

    // Check which ones exist
    try {
        const legacyInfo = await connection.getAccountInfo(legacyBondingATA);
        console.log("Legacy ATA exists:", !!legacyInfo);
        if (legacyInfo) {
            console.log("  Owner:", legacyInfo.owner.toBase58());
        }
    } catch (e) {
        console.log("Legacy ATA exists: false");
    }

    try {
        const token2022Info = await connection.getAccountInfo(token2022BondingATA);
        console.log("Token2022 ATA exists:", !!token2022Info);
        if (token2022Info) {
            console.log("  Owner:", token2022Info.owner.toBase58());
        }
    } catch (e) {
        console.log("Token2022 ATA exists: false");
    }

    // Get bonding curve account
    try {
        const curveAccount = await sdk.token.getBondingCurveAccount(mint);
        if (curveAccount) {
            console.log("\nBonding curve state:");
            console.log("  Virtual SOL reserves:", curveAccount.virtualSolReserves.toString());
            console.log("  Virtual token reserves:", curveAccount.virtualTokenReserves.toString());
            console.log("  Real SOL reserves:", curveAccount.realSolReserves.toString());
            console.log("  Real token reserves:", curveAccount.realTokenReserves.toString());
        }
    } catch (e) {
        console.error("Failed to get bonding curve account:", e);
    }

    // Try to sell
    console.log("\n=== Attempting sell ===");
    console.log("Selling amount:", balance);
    console.log("Slippage:", SLIPPAGE_BPS, "bps");

    try {
        const result = await sdk.trade.sell(
            wallet,
            mint,
            BigInt(balance),
            SLIPPAGE_BPS,
            PRIORITY
        );

        if (result.success) {
            console.log("\n✅ SELL SUCCESSFUL!");
            console.log("Signature:", result.signature);
        } else {
            console.log("\n❌ SELL FAILED");
            console.log("Result:", result);
        }
    } catch (error: any) {
        console.error("\n❌ SELL ERROR:");
        console.error("Message:", error.message);
        if (error.logs) {
            console.error("Logs:", error.logs);
        }
    }
}

main().catch((e) => {
    console.error("Script error:", e);
    process.exit(1);
});
