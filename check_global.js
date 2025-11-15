const { Connection, PublicKey } = require("@solana/web3.js");

const connection = new Connection("https://api.mainnet-beta.solana.com");
const PUMP_PROGRAM = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");

async function checkGlobal() {
  const [globalPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("global")],
    PUMP_PROGRAM
  );
  
  console.log("Global PDA:", globalPda.toBase58());
  
  const accountInfo = await connection.getAccountInfo(globalPda);
  console.log("Total size:", accountInfo.data.length);
  console.log("Without discriminator:", accountInfo.data.length - 8);
  console.log("First 100 bytes (hex):", accountInfo.data.subarray(0, 100).toString("hex"));
}

checkGlobal().catch(console.error);
