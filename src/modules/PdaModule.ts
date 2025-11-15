import { PublicKey } from "@solana/web3.js";
import {
  GLOBAL_ACCOUNT_SEED,
  EVENT_AUTHORITY_SEED,
  BONDING_CURVE_SEED,
  MINT_AUTHORITY_SEED,
  MPL_TOKEN_METADATA_PROGRAM_ID,
  METADATA_SEED,
  GLOBAL_VOLUME_SEED,
  USER_VOLUME_SEED,
  PUMP_PROGRAM_ID,
  PUMP_FEE_PROGRAM_ID,
  MAYHEM_PROGRAM_ID,
  MAYHEM_STATE_SEED,
  GLOBAL_PARAMS_SEED,
  SOL_VAULT_SEED,
} from "../pumpFun.consts.js";
import { PumpFunSDK } from "../PumpFunSDK.js";

export class PdaModule {
  constructor(private sdk: PumpFunSDK) {}

  getCreatorVaultPda(creator: PublicKey): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("creator-vault"), creator.toBuffer()],
      this.sdk.program.programId
    )[0];
  }

  getGlobalAccountPda(): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(GLOBAL_ACCOUNT_SEED)],
      this.sdk.program.programId
    )[0];
  }

  getEventAuthorityPda(): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(EVENT_AUTHORITY_SEED)],
      this.sdk.program.programId
    )[0];
  }

  getBondingCurvePDA(mint: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(BONDING_CURVE_SEED), mint.toBuffer()],
      this.sdk.program.programId
    )[0];
  }

  getMintAuthorityPDA() {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(MINT_AUTHORITY_SEED)],
      this.sdk.program.programId
    )[0];
  }

  getPumpFeeConfigPda(): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("fee_config"), PUMP_PROGRAM_ID.toBuffer()],
      PUMP_FEE_PROGRAM_ID
    )[0];
  }

  getMetadataPDA(mint: PublicKey): PublicKey {
    const metadataProgram = new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID);

    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(METADATA_SEED), metadataProgram.toBuffer(), mint.toBuffer()],
      metadataProgram
    );
    return metadataPDA;
  }

  getGlobalVolumeAccumulatorPda(): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(GLOBAL_VOLUME_SEED)],
      this.sdk.program.programId
    )[0];
  }

  getUserVolumeAccumulatorPda(user: PublicKey): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(USER_VOLUME_SEED), user.toBuffer()],
      this.sdk.program.programId
    )[0];
  }

  // Mayhem mode PDAs (Breaking change Nov 11, 2025)
  getMayhemStatePda(mint: PublicKey): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(MAYHEM_STATE_SEED), mint.toBuffer()],
      MAYHEM_PROGRAM_ID
    )[0];
  }

  getGlobalParamsPda(): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(GLOBAL_PARAMS_SEED)],
      MAYHEM_PROGRAM_ID
    )[0];
  }

  getSolVaultPda(): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(SOL_VAULT_SEED)],
      MAYHEM_PROGRAM_ID
    )[0];
  }

  getMayhemTokenVaultPda(mint: PublicKey): PublicKey {
    const solVault = this.getSolVaultPda();
    const TOKEN_2022_PROGRAM = new PublicKey(
      "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
    );
    
    // This is an Associated Token Account PDA for the sol vault
    return PublicKey.findProgramAddressSync(
      [solVault.toBuffer(), TOKEN_2022_PROGRAM.toBuffer(), mint.toBuffer()],
      new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL") // Associated Token Program
    )[0];
  }
}
