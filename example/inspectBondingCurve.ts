import { Connection, PublicKey } from "@solana/web3.js";
import { BondingCurveAccount } from "../src/BondingCurveAccount";

const connection = new Connection("https://api.mainnet-beta.solana.com", "finalized");

async function inspectBondingCurve() {
  const bondingCurvePDA = new PublicKey("HAN2UYayu4LNicPT1yXR1JybeyPc3AVX8TrQSgm9f5Ps");
  
  const account = await connection.getAccountInfo(bondingCurvePDA);
  
  if (!account) {
    console.log("Account not found!");
    return;
  }
  
  console.log("Account found!");
  console.log("Size:", account.data.length);
  console.log("Owner:", account.owner.toBase58());
  console.log("\nRaw data (first 200 bytes):");
  console.log(account.data.subarray(0, 200).toString('hex'));
  
  console.log("\n" + "=".repeat(50));
  console.log("Parsing with 8-byte discriminator skip:");
  console.log("=".repeat(50));
  
  try {
    const accountData = account.data.subarray(8);
    const parsed = BondingCurveAccount.fromBuffer(accountData);
    console.log("\nParsed successfully:");
    console.log(JSON.stringify(parsed, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    , 2));
  } catch (error) {
    console.error("Failed to parse:", error);
  }
  
  console.log("\n" + "=".repeat(50));
  console.log("Trying without discriminator skip:");
  console.log("=".repeat(50));
  
  try {
    const parsed2 = BondingCurveAccount.fromBuffer(account.data);
    console.log("\nParsed successfully:");
    console.log(JSON.stringify(parsed2, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    , 2));
  } catch (error) {
    console.error("Failed to parse:", error);
  }
}

inspectBondingCurve().catch(console.error);
