import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const PUMP_PROGRAM = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");

// Example token mint - replace with actual one
const mint = new PublicKey("CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump"); // Popular token

async function checkBondingCurve() {
  const [bondingCurvePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("bonding-curve"), mint.toBuffer()],
    PUMP_PROGRAM
  );
  
  console.log("Bonding Curve PDA:", bondingCurvePda.toBase58());
  
  const accountInfo = await connection.getAccountInfo(bondingCurvePda);
  console.log("Total size:", accountInfo.data.length);
  console.log("Without discriminator:", accountInfo.data.length - 8);
}

checkBondingCurve().catch(console.error);
