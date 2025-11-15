import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.mainnet-beta.solana.com", "finalized");

async function analyzeGlobalAccount() {
  const globalPDA = new PublicKey("4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf");
  const account = await connection.getAccountInfo(globalPDA);
  
  if (!account) {
    console.log("Account not found!");
    return;
  }
  
  console.log("Global Account Size:", account.data.length);
  console.log("\nFirst 400 bytes (hex):");
  console.log(account.data.subarray(0, 400).toString('hex'));
  
  console.log("\n" + "=".repeat(50));
  console.log("Parsing individual fields:");
  console.log("=".repeat(50));
  
  let offset = 0;
  
  // Try to identify what's at each position
  console.log(`\nOffset 0 (u64 discriminator?): ${account.data.readBigUInt64LE(offset)}`);
  offset += 8;
  
  console.log(`Offset 8 (byte): ${account.data[offset]} (0x${account.data[offset].toString(16)})`);
  offset += 1;
  
  console.log(`Offset 9-40 (32 bytes - PublicKey authority?):`);
  const pubkey1 = new PublicKey(account.data.subarray(offset, offset + 32));
  console.log(`  ${pubkey1.toBase58()}`);
  offset += 32;
  
  console.log(`Offset 41-72 (32 bytes - PublicKey feeRecipient?):`);
  const pubkey2 = new PublicKey(account.data.subarray(offset, offset + 32));
  console.log(`  ${pubkey2.toBase58()}`);
  offset += 32;
  
  console.log(`Offset 73 (u64): ${account.data.readBigUInt64LE(offset)}`);
  offset += 8;
  
  console.log(`Offset 81 (u64): ${account.data.readBigUInt64LE(offset)}`);
  offset += 8;
  
  console.log(`Offset 89 (u64): ${account.data.readBigUInt64LE(offset)}`);
  offset += 8;
  
  console.log(`Offset 97 (u64): ${account.data.readBigUInt64LE(offset)}`);
  offset += 8;
  
  console.log(`Offset 105 (u64): ${account.data.readBigUInt64LE(offset)}`);
  offset += 8;
  
  console.log(`Offset 113-144 (32 bytes - PublicKey withdrawAuthority?):`);
  const pubkey3 = new PublicKey(account.data.subarray(offset, offset + 32));
  console.log(`  ${pubkey3.toBase58()}`);
  offset += 32;
  
  console.log(`Offset 145 (byte): ${account.data[offset]} (0x${account.data[offset].toString(16)})`);
  offset += 1;
  
  console.log(`Offset 146 (u64): ${account.data.readBigUInt64LE(offset)}`);
  offset += 8;
  
  console.log(`Offset 154 (u64): ${account.data.readBigUInt64LE(offset)}`);
  offset += 8;
  
  console.log(`Offset 162-193 (32 bytes - PublicKey reservedFeeRecipient?):`);
  const pubkey4 = new PublicKey(account.data.subarray(offset, offset + 32));
  console.log(`  ${pubkey4.toBase58()}`);
  offset += 32;
  
  console.log(`Offset 194 (byte): ${account.data[offset]} (0x${account.data[offset].toString(16)})`);
  offset += 1;
  
  console.log(`\nTotal offset used: ${offset} bytes`);
  console.log(`Remaining bytes: ${account.data.length - offset}`);
}

analyzeGlobalAccount().catch(console.error);
