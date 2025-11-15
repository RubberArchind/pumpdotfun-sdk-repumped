import "dotenv/config";
import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    Keypair,
} from "@solana/web3.js";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { wallet } from "./utils.js";
import { PumpFunSDK } from "../src/index.js";
import {
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
    TOKEN_2022_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    getAccount,
} from "@solana/spl-token";

const RPC = process.env.HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com";

/**
 * This script fixes tokens created with the OLD createV2 that have Token2022 bonding curve ATA
 * by creating the missing legacy bonding curve ATA that sell instructions require.
 */
async function main() {
    const mintAddress = process.argv[2];
    if (!mintAddress) {
        console.error("Usage: bun run example/fixOldToken.ts <MINT_ADDRESS>");
        process.exit(1);
    }

    const mint = new PublicKey(mintAddress);
    const connection = new Connection(RPC, { commitment: "confirmed" });
    const dummyWallet = new Wallet(wallet);
    const provider = new AnchorProvider(connection, dummyWallet, {
        commitment: "confirmed",
    });
    const sdk = new PumpFunSDK(provider);

    console.log("Analyzing token:", mint.toBase58());

    const bondingCurve = sdk.pda.getBondingCurvePDA(mint);
    console.log("Bonding curve:", bondingCurve.toBase58());

    // Check both ATAs
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

    console.log("\nLegacy bonding ATA:", legacyBondingATA.toBase58());
    console.log("Token2022 bonding ATA:", token2022BondingATA.toBase58());

    // Check which exist
    const legacyInfo = await connection.getAccountInfo(legacyBondingATA);
    const token2022Info = await connection.getAccountInfo(token2022BondingATA);

    console.log("\nLegacy ATA exists:", !!legacyInfo);
    console.log("Token2022 ATA exists:", !!token2022Info);

    if (legacyInfo) {
        console.log("\n✅ Token already has legacy bonding curve ATA - no fix needed!");
        process.exit(0);
    }

    if (!token2022Info) {
        console.log("\n❌ Token has no bonding curve ATA at all - this is unexpected!");
        process.exit(1);
    }

    // Token2022 ATA exists but legacy doesn't - this is the problem
    console.log("\n⚠️  Token has Token2022 bonding ATA but missing legacy ATA");
    console.log("This was created with the OLD createV2 before the fix");

    // Get token2022 ATA balance
    try {
        const token2022Account = await getAccount(
            connection,
            token2022BondingATA,
            "confirmed",
            TOKEN_2022_PROGRAM_ID
        );
        console.log("\nToken2022 bonding ATA balance:", token2022Account.amount.toString());

        if (token2022Account.amount > 0n) {
            console.log("\n❌ CANNOT FIX: Token2022 bonding ATA has tokens");
            console.log("Pump.fun sell instruction requires legacy ATA with these tokens");
            console.log("This token cannot be sold through pump.fun directly");
            console.log("\nOptions:");
            console.log("1. Use Jupiter to sell (it handles Token2022 → legacy transfer)");
            console.log("2. Manually transfer tokens from Token2022 ATA → legacy ATA (if you create it)");
            process.exit(1);
        }
    } catch (e) {
        console.error("Error reading Token2022 ATA:", e);
    }

    console.log("\n✅ Token2022 bonding ATA is empty - we can create legacy ATA");
    console.log("Creating legacy bonding curve ATA...");

    const transaction = new Transaction();

    // Create legacy bonding curve ATA
    transaction.add(
        createAssociatedTokenAccountInstruction(
            wallet.publicKey, // payer
            legacyBondingATA, // ata
            bondingCurve, // owner
            mint, // mint
            TOKEN_PROGRAM_ID // token program
        )
    );

    try {
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [wallet],
            { commitment: "confirmed" }
        );

        console.log("\n✅ Legacy bonding curve ATA created!");
        console.log("Signature:", signature);
        console.log("\nNOTE: The bonding curve ATA is empty. Tokens are in Token2022 ATA.");
        console.log("You'll need to transfer tokens from Token2022 ATA to legacy ATA");
        console.log("before selling through pump.fun");
    } catch (error) {
        console.error("\n❌ Failed to create ATA:", error);
        process.exit(1);
    }
}

main().catch((e) => {
    console.error("Script error:", e);
    process.exit(1);
});
