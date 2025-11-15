import { AnchorProvider } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import bs58 from "bs58";
import { PumpFunSDK } from "../src";
import { GlobalAccount } from "../src/GlobalAccount";

const connection = new Connection("https://api.mainnet-beta.solana.com", "finalized");

async function inspectGlobalAccount() {
  const secretKeyBase58 = bs58.encode([180, 60, 253, 69, 193, 224, 197, 142, 94, 143, 130, 39, 207, 91, 245, 97, 39, 87, 126, 102, 119, 78, 87, 110, 58, 111, 69, 181, 8, 235, 0, 150, 154, 196, 147, 212, 129, 166, 107, 155, 12, 211, 30, 76, 187, 88, 135, 133, 125, 232, 250, 194, 89, 222, 238, 124, 167, 185, 55, 188, 251, 134, 152, 30]);
  const privateKey = bs58.decode(secretKeyBase58);
  const fromKeypair = Keypair.fromSecretKey(privateKey);
  const wallet = new NodeWallet(fromKeypair);
  const provider = new AnchorProvider(connection, wallet, { commitment: "finalized" });
  const sdk = new PumpFunSDK(provider);
  
  const globalAccountPDA = sdk.pda.getGlobalAccountPda();
  console.log("Global Account PDA:", globalAccountPDA.toBase58());
  
  const account = await connection.getAccountInfo(globalAccountPDA);
  
  if (!account) {
    console.log("Account not found!");
    return;
  }
  
  console.log("\nAccount found!");
  console.log("Size:", account.data.length);
  console.log("Owner:", account.owner.toBase58());
  console.log("\nRaw data (first 300 bytes):");
  console.log(account.data.subarray(0, 300).toString('hex'));
  
  console.log("\n" + "=".repeat(50));
  console.log("Parsing with 8-byte discriminator skip:");
  console.log("=".repeat(50));
  
  try {
    const accountData = account.data.subarray(8);
    const parsed = GlobalAccount.fromBuffer(accountData);
    console.log("\nParsed successfully:");
    console.log(JSON.stringify(parsed, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    , 2));
  } catch (error: any) {
    console.error("Failed to parse:", error.message);
  }
  
  console.log("\n" + "=".repeat(50));
  console.log("Trying without discriminator skip:");
  console.log("=".repeat(50));
  
  try {
    const parsed2 = GlobalAccount.fromBuffer(account.data);
    console.log("\nParsed successfully:");
    console.log(JSON.stringify(parsed2, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    , 2));
  } catch (error: any) {
    console.error("Failed to parse:", error.message);
  }
}

inspectGlobalAccount().catch(console.error);
