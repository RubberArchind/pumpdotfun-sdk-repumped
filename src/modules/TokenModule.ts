import {
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey, Transaction, Commitment } from "@solana/web3.js";
import { DEFAULT_COMMITMENT } from "../pumpFun.consts.js";
import { CreateTokenMetadata } from "../pumpFun.types.js";
import { PumpFunSDK } from "../PumpFunSDK.js";
import { BondingCurveAccount } from "../BondingCurveAccount.js";
import { GlobalAccount } from "../GlobalAccount.js";
import { FeeConfig } from "../FeeConfig.js";

export class TokenModule {
  constructor(private sdk: PumpFunSDK) {}

  async createTokenMetadata(create: CreateTokenMetadata) {
    // Validate file
    if (!(create.file instanceof Blob)) {
      throw new Error("File must be a Blob or File object");
    }

    let formData = new FormData();
    formData.append("file", create.file, "image.png"); // Add filename
    formData.append("name", create.name);
    formData.append("symbol", create.symbol);
    formData.append("description", create.description);
    formData.append("twitter", create.twitter || "");
    formData.append("telegram", create.telegram || "");
    formData.append("website", create.website || "");
    formData.append("showName", "true");

    try {
      const request = await fetch("https://pump.fun/api/ipfs", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
        credentials: "same-origin",
      });

      if (request.status === 500) {
        // Try to get more error details
        const errorText = await request.text();
        throw new Error(
          `Server error (500): ${errorText || "No error details available"}`
        );
      }

      if (!request.ok) {
        throw new Error(`HTTP error! status: ${request.status}`);
      }

      const responseText = await request.text();
      if (!responseText) {
        throw new Error("Empty response received from server");
      }

      try {
        return JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
    } catch (error) {
      console.error("Error in createTokenMetadata:", error);
      throw error;
    }
  }

  async createAssociatedTokenAccountIfNeeded(
    payer: PublicKey,
    owner: PublicKey,
    mint: PublicKey,
    transaction: Transaction,
    commitment: Commitment = DEFAULT_COMMITMENT,
    allowOwnerOffCurve: boolean = false
  ): Promise<PublicKey> {
    // Detect which token program this mint uses
    const mintAccount = await this.sdk.connection.getAccountInfo(mint, commitment);
    if (!mintAccount) {
      throw new Error(`Mint account not found: ${mint.toBase58()}`);
    }
    
    // Determine if this is a Token2022 mint by checking the owner
    const tokenProgramId = mintAccount.owner.equals(TOKEN_2022_PROGRAM_ID)
      ? TOKEN_2022_PROGRAM_ID
      : TOKEN_PROGRAM_ID;
    
    const associatedTokenAccount = await getAssociatedTokenAddress(
      mint,
      owner,
      allowOwnerOffCurve,
      tokenProgramId
    );

    try {
      await getAccount(this.sdk.connection, associatedTokenAccount, commitment, tokenProgramId);
    } catch (e) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          payer,
          associatedTokenAccount,
          owner,
          mint,
          tokenProgramId
        )
      );
    }

    return associatedTokenAccount;
  }

  async getBondingCurveAccount(
    mint: PublicKey,
    commitmentOrTokenProgram?: Commitment | PublicKey,
    commitment: Commitment = DEFAULT_COMMITMENT
  ) {
    // Handle overloaded parameters - if second param is PublicKey, it's tokenProgram
    let tokenProgram: PublicKey | undefined;
    let actualCommitment: Commitment;
    
    if (commitmentOrTokenProgram instanceof PublicKey) {
      tokenProgram = commitmentOrTokenProgram;
      actualCommitment = commitment;
    } else {
      tokenProgram = undefined;
      actualCommitment = commitmentOrTokenProgram || commitment;
    }
    
    const tokenAccount = await this.sdk.connection.getAccountInfo(
      this.sdk.pda.getBondingCurvePDA(mint, tokenProgram),
      actualCommitment
    );
    if (!tokenAccount) {
      return null;
    }
    // Note: Bonding curve accounts do NOT have the 8-byte Anchor discriminator
    // Parse the data directly without skipping bytes
    return BondingCurveAccount.fromBuffer(tokenAccount.data);
  }

  async getGlobalAccount(commitment: Commitment = DEFAULT_COMMITMENT) {
    const globalAccountPDA = this.sdk.pda.getGlobalAccountPda();

    const tokenAccount = await this.sdk.connection.getAccountInfo(
      globalAccountPDA,
      commitment
    );

    // Note: Global account does NOT have the 8-byte Anchor discriminator
    // Parse the data directly without skipping bytes
    return GlobalAccount.fromBuffer(tokenAccount!.data);
  }

  async getFeeConfig(commitment: Commitment = DEFAULT_COMMITMENT) {
    const feePda = this.sdk.pda.getPumpFeeConfigPda();
    // @ts-ignore: feeConfig account is missing in generated Anchor types
    const anchorFee = await this.sdk.program.account.feeConfig.fetch(feePda);
    return FeeConfig.convert(anchorFee);
  }

  async getBondingCurveCreator(
    bondingCurvePDA: PublicKey,
    commitment: Commitment = DEFAULT_COMMITMENT
  ): Promise<PublicKey> {
    const bondingAccountInfo = await this.sdk.connection.getAccountInfo(
      bondingCurvePDA,
      commitment
    );
    if (!bondingAccountInfo) {
      throw new Error("Bonding curve account not found");
    }

    // Creator is at offset 49 (after 8 bytes discriminator, 5 u64 fields, and 1 byte boolean)
    const creatorBytes = bondingAccountInfo.data.subarray(49, 49 + 32);
    return new PublicKey(creatorBytes);
  }
}
