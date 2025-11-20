import "dotenv/config";
import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
    getAccount,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
    TOKEN_2022_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    createTransferCheckedInstruction,
    getMinimumBalanceForRentExemptAccount,
} from "@solana/spl-token";
import { DEFAULT_DECIMALS } from "../src/pumpFun.consts.js";
import bs58 from "bs58";

const RPC = process.env.HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com";

/**
 * Transfers tokens from Token2022 ATA to legacy ATA
 * This is needed for tokens bought/created with Token2022 but need to be sold on pump.fun
 */
async function main() {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.error("Usage: npm run transfer-to-legacy <MINT_ADDRESS> <PRIVATE_KEY>");
        console.error("\nThis script transfers tokens from Token2022 ATA to legacy ATA");
        console.error("so they can be sold through pump.fun");
        process.exit(1);
    }

    const mintAddress = args[0];
    const privateKeyStr = args[1];

    // Parse private key
    let owner: Keypair;
    try {
        const privateKeyBytes = bs58.decode(privateKeyStr);
        owner = Keypair.fromSecretKey(privateKeyBytes);
    } catch (error) {
        console.error("Error: Invalid private key format");
        process.exit(1);
    }

    // Parse mint
    let mint: PublicKey;
    try {
        mint = new PublicKey(mintAddress);
    } catch (error) {
        console.error("Error: Invalid mint address");
        process.exit(1);
    }

    console.log("=== Transfer Token2022 → Legacy ATA ===");
    console.log("Mint:", mint.toBase58());
    console.log("Owner:", owner.publicKey.toBase58());

    const connection = new Connection(RPC, { commitment: "confirmed" });

    // Get both ATAs
    const token2022ATA = await getAssociatedTokenAddress(
        mint,
        owner.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
    );
    const legacyATA = await getAssociatedTokenAddress(
        mint,
        owner.publicKey,
        false,
        TOKEN_PROGRAM_ID
    );

    console.log("\nToken2022 ATA:", token2022ATA.toBase58());
    console.log("Legacy ATA:", legacyATA.toBase58());

    // Check Token2022 ATA balance
    let token2022Balance: bigint;
    try {
        const account = await getAccount(
            connection,
            token2022ATA,
            "confirmed",
            TOKEN_2022_PROGRAM_ID
        );
        token2022Balance = account.amount;
    } catch (error) {
        console.error("\n❌ Token2022 ATA not found or empty");
        process.exit(1);
    }

    const balanceDecimal = Number(token2022Balance) / 10 ** DEFAULT_DECIMALS;
    console.log("\nToken2022 ATA balance:", balanceDecimal.toFixed(DEFAULT_DECIMALS));

    if (token2022Balance === 0n) {
        console.error("❌ No tokens to transfer");
        process.exit(1);
    }

    // Check if legacy ATA exists
    let legacyExists = false;
    try {
        await getAccount(connection, legacyATA, "confirmed", TOKEN_PROGRAM_ID);
        legacyExists = true;
        console.log("✓ Legacy ATA already exists");
    } catch (error) {
        console.log("⚠️  Legacy ATA does not exist - will create it");
    }

    // Build transaction
    const transaction = new Transaction();

    // Create legacy ATA if needed
    if (!legacyExists) {
        transaction.add(
            createAssociatedTokenAccountInstruction(
                owner.publicKey, // payer
                legacyATA, // ata
                owner.publicKey, // owner
                mint, // mint
                TOKEN_PROGRAM_ID
            )
        );
        console.log("→ Added instruction to create legacy ATA");
    }

    // Transfer tokens from Token2022 ATA to legacy ATA
    transaction.add(
        createTransferCheckedInstruction(
            token2022ATA, // source
            mint, // mint
            legacyATA, // destination
            owner.publicKey, // owner
            token2022Balance, // amount
            DEFAULT_DECIMALS, // decimals
            [], // signers
            TOKEN_2022_PROGRAM_ID // token program
        )
    );
    console.log("→ Added instruction to transfer", balanceDecimal.toFixed(DEFAULT_DECIMALS), "tokens");

    // Check SOL balance
    const solBalance = await connection.getBalance(owner.publicKey);
    console.log("\nSOL balance:", (solBalance / LAMPORTS_PER_SOL).toFixed(4), "SOL");

    if (solBalance < 0.01 * LAMPORTS_PER_SOL) {
        console.error("❌ Insufficient SOL for transaction (need at least 0.01 SOL)");
        process.exit(1);
    }

    // Send transaction
    console.log("\n=== Sending Transaction ===");
    try {
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [owner],
            {
                commitment: "confirmed",
                skipPreflight: false,
            }
        );

        console.log("\n✅ TRANSFER SUCCESSFUL!");
        console.log("Signature:", signature);
        console.log("Explorer:", `https://solscan.io/tx/${signature}`);

        // Verify transfer
        console.log("\n=== Verifying Transfer ===");
        const newLegacyAccount = await getAccount(
            connection,
            legacyATA,
            "confirmed",
            TOKEN_PROGRAM_ID
        );
        const newLegacyBalance = Number(newLegacyAccount.amount) / 10 ** DEFAULT_DECIMALS;
        console.log("Legacy ATA balance:", newLegacyBalance.toFixed(DEFAULT_DECIMALS));

        try {
            const newToken2022Account = await getAccount(
                connection,
                token2022ATA,
                "confirmed",
                TOKEN_2022_PROGRAM_ID
            );
            const newToken2022Balance = Number(newToken2022Account.amount) / 10 ** DEFAULT_DECIMALS;
            console.log("Token2022 ATA balance:", newToken2022Balance.toFixed(DEFAULT_DECIMALS));
        } catch (error) {
            console.log("Token2022 ATA balance: 0 (closed)");
        }

        console.log("\n✅ Tokens are now in legacy ATA!");
        console.log("You can now sell through pump.fun using:");
        console.log(`npm run sell ${mint.toBase58()} ${privateKeyStr}`);
    } catch (error: any) {
        console.error("\n❌ TRANSFER FAILED");
        console.error("Error:", error.message);
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
