'use strict';

var web3_js = require('@solana/web3.js');
var pumpFun_consts = require('../pumpFun.consts.cjs');

class PdaModule {
    sdk;
    constructor(sdk) {
        this.sdk = sdk;
    }
    getCreatorVaultPda(creator) {
        return web3_js.PublicKey.findProgramAddressSync([Buffer.from("creator-vault"), creator.toBuffer()], this.sdk.program.programId)[0];
    }
    getGlobalAccountPda() {
        return web3_js.PublicKey.findProgramAddressSync([Buffer.from(pumpFun_consts.GLOBAL_ACCOUNT_SEED)], this.sdk.program.programId)[0];
    }
    getEventAuthorityPda() {
        return web3_js.PublicKey.findProgramAddressSync([Buffer.from(pumpFun_consts.EVENT_AUTHORITY_SEED)], this.sdk.program.programId)[0];
    }
    getBondingCurvePDA(mint) {
        return web3_js.PublicKey.findProgramAddressSync([Buffer.from(pumpFun_consts.BONDING_CURVE_SEED), mint.toBuffer()], this.sdk.program.programId)[0];
    }
    getMintAuthorityPDA() {
        return web3_js.PublicKey.findProgramAddressSync([Buffer.from(pumpFun_consts.MINT_AUTHORITY_SEED)], this.sdk.program.programId)[0];
    }
    getPumpFeeConfigPda() {
        return web3_js.PublicKey.findProgramAddressSync([Buffer.from("fee_config"), pumpFun_consts.PUMP_PROGRAM_ID.toBuffer()], pumpFun_consts.PUMP_FEE_PROGRAM_ID)[0];
    }
    getMetadataPDA(mint) {
        const metadataProgram = new web3_js.PublicKey(pumpFun_consts.MPL_TOKEN_METADATA_PROGRAM_ID);
        const [metadataPDA] = web3_js.PublicKey.findProgramAddressSync([Buffer.from(pumpFun_consts.METADATA_SEED), metadataProgram.toBuffer(), mint.toBuffer()], metadataProgram);
        return metadataPDA;
    }
    getGlobalVolumeAccumulatorPda() {
        return web3_js.PublicKey.findProgramAddressSync([Buffer.from(pumpFun_consts.GLOBAL_VOLUME_SEED)], this.sdk.program.programId)[0];
    }
    getUserVolumeAccumulatorPda(user) {
        return web3_js.PublicKey.findProgramAddressSync([Buffer.from(pumpFun_consts.USER_VOLUME_SEED), user.toBuffer()], this.sdk.program.programId)[0];
    }
    // Mayhem mode PDAs (Breaking change Nov 11, 2025)
    getMayhemStatePda(mint) {
        return web3_js.PublicKey.findProgramAddressSync([Buffer.from(pumpFun_consts.MAYHEM_STATE_SEED), mint.toBuffer()], pumpFun_consts.MAYHEM_PROGRAM_ID)[0];
    }
    getGlobalParamsPda() {
        return web3_js.PublicKey.findProgramAddressSync([Buffer.from(pumpFun_consts.GLOBAL_PARAMS_SEED)], pumpFun_consts.MAYHEM_PROGRAM_ID)[0];
    }
    getSolVaultPda() {
        return web3_js.PublicKey.findProgramAddressSync([Buffer.from(pumpFun_consts.SOL_VAULT_SEED)], pumpFun_consts.MAYHEM_PROGRAM_ID)[0];
    }
    getMayhemTokenVaultPda(mint) {
        const solVault = this.getSolVaultPda();
        const TOKEN_2022_PROGRAM = new web3_js.PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
        // This is an Associated Token Account PDA for the sol vault
        return web3_js.PublicKey.findProgramAddressSync([solVault.toBuffer(), TOKEN_2022_PROGRAM.toBuffer(), mint.toBuffer()], new web3_js.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL") // Associated Token Program
        )[0];
    }
}

exports.PdaModule = PdaModule;
//# sourceMappingURL=PdaModule.cjs.map
