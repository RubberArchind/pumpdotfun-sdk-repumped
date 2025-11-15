import { AnchorProvider } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import bs58 from "bs58";
import { PumpFunSDK, TOKEN_2022_PROGRAM_ID, LEGACY_TOKEN_PROGRAM_ID } from "../src";

const connection = new Connection("https://api.mainnet-beta.solana.com", "finalized");

type TokenStatus = {
  exists: boolean;
  onBondingCurve: boolean;
  graduated: boolean;
  complete: boolean;
  tokenProgram: string;
};

/**
 * Get comprehensive status of a pump.fun token
 */
async function getTokenStatus(mint: string): Promise<TokenStatus> {
  const secretKeyBase58 = bs58.encode([180, 60, 253, 69, 193, 224, 197, 142, 94, 143, 130, 39, 207, 91, 245, 97, 39, 87, 126, 102, 119, 78, 87, 110, 58, 111, 69, 181, 8, 235, 0, 150, 154, 196, 147, 212, 129, 166, 107, 155, 12, 211, 30, 76, 187, 88, 135, 133, 125, 232, 250, 194, 89, 222, 238, 124, 167, 185, 55, 188, 251, 134, 152, 30]);
  const privateKey = bs58.decode(secretKeyBase58);
  const fromKeypair = Keypair.fromSecretKey(privateKey);
  let getProvider = () => {
    const wallet = new NodeWallet(fromKeypair);
    return new AnchorProvider(connection, wallet, { commitment: "finalized" });
  };
  const provider = getProvider();
  const sdk = new PumpFunSDK(provider);

  const mintPubkey = new PublicKey(mint);
  
  // Check if mint exists
  const mintAccount = await connection.getAccountInfo(mintPubkey);
  if (!mintAccount) {
    return {
      exists: false,
      onBondingCurve: false,
      graduated: false,
      complete: false,
      tokenProgram: "none",
    };
  }
  
  // Determine token program
  const tokenProgram = mintAccount.owner.equals(TOKEN_2022_PROGRAM_ID) 
    ? TOKEN_2022_PROGRAM_ID 
    : LEGACY_TOKEN_PROGRAM_ID;
  
  // Try to get bonding curve account
  let bondingCurveAccount;
  try {
    bondingCurveAccount = await sdk.token.getBondingCurveAccount(mintPubkey, tokenProgram);
  } catch (error) {
    // Error fetching - token might not be on pump.fun
    bondingCurveAccount = null;
  }

  if (!bondingCurveAccount) {
    // No bonding curve account found
    return {
      exists: true,
      onBondingCurve: false,
      graduated: true, // Assume graduated if no bonding curve
      complete: true,
      tokenProgram: tokenProgram.toBase58(),
    };
  }

  // Bonding curve account exists
  const isComplete = bondingCurveAccount.complete ?? false;
  
  return {
    exists: true,
    onBondingCurve: !isComplete,
    graduated: isComplete,
    complete: isComplete,
    tokenProgram: tokenProgram.toBase58(),
  };
}

async function main() {
  const testMint = "7Ejqa5vWAHZvjPckJjBvX3dNN3mv5BDZ3jVaUDMwpump";
  
  console.log(`Checking token: ${testMint}`);
  console.log(`Solscan: https://solscan.io/token/${testMint}\n`);
  
  const status = await getTokenStatus(testMint);
  
  console.log("Token Status:");
  console.log("─".repeat(50));
  console.log(`Exists:           ${status.exists}`);
  console.log(`On Bonding Curve: ${status.onBondingCurve}`);
  console.log(`Graduated:        ${status.graduated}`);
  console.log(`Complete:         ${status.complete}`);
  console.log(`Token Program:    ${status.tokenProgram}`);
  console.log("─".repeat(50));
  
  if (status.onBondingCurve) {
    console.log("\n✅ Token is ACTIVE on pump.fun bonding curve");
  } else if (status.graduated) {
    console.log("\n🎓 Token has GRADUATED to Raydium");
  } else {
    console.log("\n❓ Token not found on pump.fun");
  }
}

main().catch(console.error);
