import { Connection, PublicKey } from "@solana/web3.js";
import { PUMP_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, LEGACY_TOKEN_PROGRAM_ID } from "../src";

const connection = new Connection("https://api.mainnet-beta.solana.com", "finalized");

async function findBondingCurveAccount(mint: string) {
  const mintPubkey = new PublicKey(mint);
  
  console.log("Mint:", mint);
  console.log("Pump Program ID:", PUMP_PROGRAM_ID.toBase58());
  
  console.log("\n" + "=".repeat(50));
  console.log("Testing PDA derivations:");
  console.log("=".repeat(50));
  
  const seeds = [
    ["bonding-curve", mintPubkey.toBuffer()],
    ["bonding-curve", mintPubkey.toBuffer(), TOKEN_2022_PROGRAM_ID.toBuffer()],
    ["bonding-curve", mintPubkey.toBuffer(), LEGACY_TOKEN_PROGRAM_ID.toBuffer()],
  ];
  
  for (const seed of seeds) {
    const seedDesc = seed.map(s => {
      if (s instanceof Buffer && s.length === 32) return "mint";
      if (s instanceof Buffer) return s.toString();
      return s;
    }).join(", ");
    
    const [pda] = PublicKey.findProgramAddressSync(seed, PUMP_PROGRAM_ID);
    const account = await connection.getAccountInfo(pda);
    
    console.log(`\nSeeds: [${seedDesc}]`);
    console.log("PDA:", pda.toBase58());
    console.log("Exists:", !!account);
    if (account) {
      console.log("Size:", account.data.length);
      console.log("✅ FOUND!");
    }
  }
}

const testMint = "7Ejqa5vWAHZvjPckJjBvX3dNN3mv5BDZ3jVaUDMwpump";
findBondingCurveAccount(testMint).catch(console.error);
