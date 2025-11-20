import "dotenv/config";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
} from "@solana/web3.js";
import bs58 from "bs58";
import fs from "fs";
import { PumpFunSDK } from "../src/index.js";
import { DEFAULT_DECIMALS } from "../src/pumpFun.consts.js";
import type { CreateTokenMetadata } from "../src/pumpFun.types.js";
import { getSPL, wallet as exampleWallet } from "./utils.js";

const RPC = process.env.HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com";
const SLIPPAGE_BPS = 800n; // 8% to be safe on first tx
const PRIORITY = { unitLimit: 300_000, unitPrice: 250_000 };

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error("Usage: npm run example:create-and-sell <BASE58_PRIVATE_KEY>");
        process.exit(1);
    }

    const pk58 = args[0];
    const payer = Keypair.fromSecretKey(bs58.decode(pk58));

    const connection = new Connection(RPC, { commitment: "confirmed" });
    const provider = new AnchorProvider(connection, new Wallet(payer), {
        commitment: "confirmed",
    });
    const sdk = new PumpFunSDK(provider);

    const mint = Keypair.generate();

    const solBal = (await connection.getBalance(payer.publicKey)) / LAMPORTS_PER_SOL;
    console.log("Payer:", payer.publicKey.toBase58());
    console.log("SOL:", solBal.toFixed(4));
    if (solBal < 0.05) {
        console.error("Not enough SOL (need ~0.05 SOL to create + buy/sell)");
        process.exit(1);
    }

    // Prepare metadata image -> Blob
    const imgPath = "example/images/test.png";
    const buffer = await fs.promises.readFile(imgPath);
    const blob = new Blob([buffer], { type: "image/png" });

    const meta: CreateTokenMetadata = {
        name: "LEGACY-TEST",
        symbol: "LEGACY",
        description: "Legacy mint test token",
        file: blob as unknown as any,
    };

    console.log("\nCreating token and doing small initial buy…");
    const initialBuySol = BigInt(Math.floor(0.002 * LAMPORTS_PER_SOL));
    const createRes = await sdk.trade.createAndBuy(
        payer,
        mint,
        meta,
        initialBuySol,
        SLIPPAGE_BPS,
        PRIORITY
    );

    if (!createRes.success) {
        console.error("createAndBuy failed:", createRes);
        process.exit(1);
    }

    console.log("Created:", `https://pump.fun/${mint.publicKey.toBase58()}`);

    // Check user balance
    const balAfter = await getSPL(connection, mint.publicKey, payer.publicKey);
    console.log("User tokens:", balAfter / 10 ** DEFAULT_DECIMALS);

    // Do an extra small buy
    console.log("\nExtra buy…");
    await sdk.trade.buy(
        payer,
        mint.publicKey,
        BigInt(Math.floor(0.001 * LAMPORTS_PER_SOL)),
        SLIPPAGE_BPS,
        PRIORITY
    );

    const balBeforeSell = await getSPL(connection, mint.publicKey, payer.publicKey);
    console.log("Balance before sell:", balBeforeSell / 10 ** DEFAULT_DECIMALS);

    // Sell all held tokens
    console.log("\nSelling all…");
    const sellRes = await sdk.trade.sell(
        payer,
        mint.publicKey,
        BigInt(balBeforeSell),
        SLIPPAGE_BPS,
        PRIORITY
    );

    if (!sellRes.success) {
        console.error("Sell failed:", sellRes);
        process.exit(1);
    }

    console.log("Sell signature:", sellRes.signature);
    const finalBal = await getSPL(connection, mint.publicKey, payer.publicKey);
    console.log("Balance after sell:", finalBal / 10 ** DEFAULT_DECIMALS);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
