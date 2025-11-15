import { AnchorProvider } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Wallet } from "@coral-xyz/anchor/dist/cjs/provider.js";
import bs58 from "bs58";
import { PumpFunSDK } from "../src";

const connection = new Connection("https://api.mainnet-beta.solana.com", "finalized");

// Test tokens
const TEST_TOKENS = {
  activeToken: "7Ejqa5vWAHZvjPckJjBvX3dNN3mv5BDZ3jVaUDMwpump", // 23% bonding curve
  // Add more test tokens here as needed
};

async function runTests() {
  const secretKeyBase58 = bs58.encode([180, 60, 253, 69, 193, 224, 197, 142, 94, 143, 130, 39, 207, 91, 245, 97, 39, 87, 126, 102, 119, 78, 87, 110, 58, 111, 69, 181, 8, 235, 0, 150, 154, 196, 147, 212, 129, 166, 107, 155, 12, 211, 30, 76, 187, 88, 135, 133, 125, 232, 250, 194, 89, 222, 238, 124, 167, 185, 55, 188, 251, 134, 152, 30]);
  const privateKey = bs58.decode(secretKeyBase58);
  const fromKeypair = Keypair.fromSecretKey(privateKey);
  const wallet: Wallet = {
    publicKey: fromKeypair.publicKey,
    signTransaction: async (tx) => {
      tx.partialSign(fromKeypair);
      return tx;
    },
    signAllTransactions: async (txs) => {
      return txs.map((tx) => {
        tx.partialSign(fromKeypair);
        return tx;
      });
    },
  };
  const provider = new AnchorProvider(connection, wallet, { commitment: "finalized" });
  const sdk = new PumpFunSDK(provider);

  let passed = 0;
  let failed = 0;

  console.log("🧪 Running SDK Integration Tests");
  console.log("=".repeat(60));

  // Test 1: Get bonding curve account for active token
  console.log("\n[TEST 1] Get Bonding Curve Account (Active Token)");
  try {
    const mintPubkey = new PublicKey(TEST_TOKENS.activeToken);
    const bondingCurve = await sdk.token.getBondingCurveAccount(mintPubkey);
    
    if (!bondingCurve) {
      console.log("❌ FAILED: Bonding curve account should exist");
      failed++;
    } else if (bondingCurve.complete === true) {
      console.log("❌ FAILED: Token should not be complete (still on bonding curve)");
      failed++;
    } else {
      console.log("✅ PASSED: Bonding curve account found and not complete");
      console.log(`   - Virtual SOL: ${bondingCurve.virtualSolReserves.toString()}`);
      console.log(`   - Virtual Token: ${bondingCurve.virtualTokenReserves.toString()}`);
      console.log(`   - Complete: ${bondingCurve.complete}`);
      passed++;
    }
  } catch (error: any) {
    console.log("❌ FAILED:", error.message);
    failed++;
  }

  // Test 2: Get global account
  console.log("\n[TEST 2] Get Global Account");
  try {
    const globalAccount = await sdk.token.getGlobalAccount();
    
    if (!globalAccount) {
      console.log("❌ FAILED: Global account should exist");
      failed++;
    } else if (!globalAccount.initialized) {
      console.log("❌ FAILED: Global account should be initialized");
      failed++;
    } else {
      console.log("✅ PASSED: Global account retrieved successfully");
      console.log(`   - Authority: ${globalAccount.authority.toBase58()}`);
      console.log(`   - Fee Recipient: ${globalAccount.feeRecipient.toBase58()}`);
      console.log(`   - Fee Basis Points: ${globalAccount.feeBasisPoints.toString()}`);
      console.log(`   - Initialized: ${globalAccount.initialized}`);
      passed++;
    }
  } catch (error: any) {
    console.log("❌ FAILED:", error.message);
    failed++;
  }

  // Test 3: Check PDA derivation
  console.log("\n[TEST 3] Bonding Curve PDA Derivation");
  try {
    const mintPubkey = new PublicKey(TEST_TOKENS.activeToken);
    const pda = sdk.pda.getBondingCurvePDA(mintPubkey);
    
    // Verify the PDA actually exists on-chain
    const account = await connection.getAccountInfo(pda);
    
    if (!account) {
      console.log("❌ FAILED: PDA account should exist on-chain");
      console.log(`   - Derived PDA: ${pda.toBase58()}`);
      failed++;
    } else if (account.owner.toBase58() !== "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P") {
      console.log("❌ FAILED: PDA should be owned by Pump.fun program");
      console.log(`   - Owner: ${account.owner.toBase58()}`);
      failed++;
    } else {
      console.log("✅ PASSED: PDA derivation correct and account exists");
      console.log(`   - PDA: ${pda.toBase58()}`);
      console.log(`   - Size: ${account.data.length} bytes`);
      passed++;
    }
  } catch (error: any) {
    console.log("❌ FAILED:", error.message);
    failed++;
  }

  // Test 4: Verify bonding curve data integrity
  console.log("\n[TEST 4] Bonding Curve Data Integrity");
  try {
    const mintPubkey = new PublicKey(TEST_TOKENS.activeToken);
    const bondingCurve = await sdk.token.getBondingCurveAccount(mintPubkey);
    
    if (!bondingCurve) {
      console.log("❌ FAILED: Bonding curve account should exist");
      failed++;
    } else {
      // Verify reserves are reasonable
      const hasValidReserves = 
        bondingCurve.virtualSolReserves > 0n &&
        bondingCurve.virtualTokenReserves > 0n &&
        bondingCurve.realSolReserves >= 0n &&
        bondingCurve.realTokenReserves > 0n;
      
      if (!hasValidReserves) {
        console.log("❌ FAILED: Invalid reserve values");
        failed++;
      } else {
        console.log("✅ PASSED: Bonding curve data integrity verified");
        console.log(`   - Virtual SOL: ${bondingCurve.virtualSolReserves.toString()}`);
        console.log(`   - Virtual Tokens: ${bondingCurve.virtualTokenReserves.toString()}`);
        console.log(`   - Real SOL: ${bondingCurve.realSolReserves.toString()}`);
        console.log(`   - Real Tokens: ${bondingCurve.realTokenReserves.toString()}`);
        console.log(`   - Creator: ${bondingCurve.creator.toBase58()}`);
        passed++;
      }
    }
  } catch (error: any) {
    console.log("❌ FAILED:", error.message);
    failed++;
  }

  // Test 5: Verify token graduation check
  console.log("\n[TEST 5] Token Graduation Status");
  try {
    const mintPubkey = new PublicKey(TEST_TOKENS.activeToken);
    const bondingCurve = await sdk.token.getBondingCurveAccount(mintPubkey);
    
    if (!bondingCurve) {
      console.log("❌ FAILED: Cannot check graduation without bonding curve");
      failed++;
    } else {
      // For a token on bonding curve, complete should be false
      if (bondingCurve.complete === true) {
        console.log("❌ FAILED: Active bonding curve token should not be complete");
        console.log(`   - Expected: false, Got: ${bondingCurve.complete}`);
        failed++;
      } else {
        console.log("✅ PASSED: Token graduation status correct");
        console.log(`   - Complete: ${bondingCurve.complete}`);
        console.log(`   - Status: Still on bonding curve`);
        
        // Calculate approximate progress
        const totalSupply = bondingCurve.tokenTotalSupply;
        const remaining = bondingCurve.realTokenReserves;
        const sold = totalSupply - remaining;
        const progress = Number((sold * 10000n) / totalSupply) / 100;
        console.log(`   - Approximate progress: ${progress.toFixed(2)}%`);
        passed++;
      }
    }
  } catch (error: any) {
    console.log("❌ FAILED:", error.message);
    failed++;
  }

  // Test 6: Get Global Account PDA
  console.log("\n[TEST 6] Global Account PDA Derivation");
  try {
    const globalPda = sdk.pda.getGlobalAccountPda();
    const account = await connection.getAccountInfo(globalPda);
    
    if (!account) {
      console.log("❌ FAILED: Global account PDA should exist");
      failed++;
    } else if (account.data.length !== 740) {
      console.log("❌ FAILED: Global account should be 740 bytes");
      console.log(`   - Actual size: ${account.data.length}`);
      failed++;
    } else {
      console.log("✅ PASSED: Global account PDA correct");
      console.log(`   - PDA: ${globalPda.toBase58()}`);
      console.log(`   - Size: ${account.data.length} bytes`);
      passed++;
    }
  } catch (error: any) {
    console.log("❌ FAILED:", error.message);
    failed++;
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 Test Summary");
  console.log("=".repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log("\n🎉 All tests passed! SDK is working correctly.");
  } else {
    console.log("\n⚠️  Some tests failed. Please review the errors above.");
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error("\n💥 Test suite crashed:", error);
  process.exit(1);
});
