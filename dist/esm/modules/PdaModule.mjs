import { PublicKey } from '@solana/web3.js';
import { GLOBAL_ACCOUNT_SEED, EVENT_AUTHORITY_SEED, BONDING_CURVE_SEED, MINT_AUTHORITY_SEED, PUMP_PROGRAM_ID, PUMP_FEE_PROGRAM_ID, MPL_TOKEN_METADATA_PROGRAM_ID, METADATA_SEED, GLOBAL_VOLUME_SEED, USER_VOLUME_SEED, MAYHEM_STATE_SEED, MAYHEM_PROGRAM_ID, GLOBAL_PARAMS_SEED, SOL_VAULT_SEED } from '../pumpFun.consts.mjs';

class PdaModule {
    sdk;
    constructor(sdk) {
        this.sdk = sdk;
    }
    getCreatorVaultPda(creator) {
        return PublicKey.findProgramAddressSync([Buffer.from("creator-vault"), creator.toBuffer()], this.sdk.program.programId)[0];
    }
    getGlobalAccountPda() {
        return PublicKey.findProgramAddressSync([Buffer.from(GLOBAL_ACCOUNT_SEED)], this.sdk.program.programId)[0];
    }
    getEventAuthorityPda() {
        return PublicKey.findProgramAddressSync([Buffer.from(EVENT_AUTHORITY_SEED)], this.sdk.program.programId)[0];
    }
    getBondingCurvePDA(mint, tokenProgram) {
        // Note: Despite documentation suggesting tokenProgram should be included in seeds,
        // actual on-chain implementation uses only mint for both legacy and Token2022 tokens
        return PublicKey.findProgramAddressSync([Buffer.from(BONDING_CURVE_SEED), mint.toBuffer()], this.sdk.program.programId)[0];
    }
    getMintAuthorityPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from(MINT_AUTHORITY_SEED)], this.sdk.program.programId)[0];
    }
    getPumpFeeConfigPda() {
        return PublicKey.findProgramAddressSync([Buffer.from("fee_config"), PUMP_PROGRAM_ID.toBuffer()], PUMP_FEE_PROGRAM_ID)[0];
    }
    getMetadataPDA(mint) {
        const metadataProgram = new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID);
        const [metadataPDA] = PublicKey.findProgramAddressSync([Buffer.from(METADATA_SEED), metadataProgram.toBuffer(), mint.toBuffer()], metadataProgram);
        return metadataPDA;
    }
    getGlobalVolumeAccumulatorPda() {
        return PublicKey.findProgramAddressSync([Buffer.from(GLOBAL_VOLUME_SEED)], this.sdk.program.programId)[0];
    }
    getUserVolumeAccumulatorPda(user) {
        return PublicKey.findProgramAddressSync([Buffer.from(USER_VOLUME_SEED), user.toBuffer()], this.sdk.program.programId)[0];
    }
    // Mayhem mode PDAs (Breaking change Nov 11, 2025)
    getMayhemStatePda(mint) {
        return PublicKey.findProgramAddressSync([Buffer.from(MAYHEM_STATE_SEED), mint.toBuffer()], MAYHEM_PROGRAM_ID)[0];
    }
    getGlobalParamsPda() {
        return PublicKey.findProgramAddressSync([Buffer.from(GLOBAL_PARAMS_SEED)], MAYHEM_PROGRAM_ID)[0];
    }
    getSolVaultPda() {
        return PublicKey.findProgramAddressSync([Buffer.from(SOL_VAULT_SEED)], MAYHEM_PROGRAM_ID)[0];
    }
    getMayhemTokenVaultPda(mint) {
        const solVault = this.getSolVaultPda();
        const TOKEN_2022_PROGRAM = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
        // This is an Associated Token Account PDA for the sol vault
        return PublicKey.findProgramAddressSync([solVault.toBuffer(), TOKEN_2022_PROGRAM.toBuffer(), mint.toBuffer()], new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL") // Associated Token Program
        )[0];
    }
}

export { PdaModule };
//# sourceMappingURL=PdaModule.mjs.map
