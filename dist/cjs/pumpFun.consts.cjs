'use strict';

var web3_js = require('@solana/web3.js');
var pumpFun_types = require('./pumpFun.types.cjs');

const MPL_TOKEN_METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
const GLOBAL_ACCOUNT_SEED = "global";
const MINT_AUTHORITY_SEED = "mint-authority";
const BONDING_CURVE_SEED = "bonding-curve";
const METADATA_SEED = "metadata";
const EVENT_AUTHORITY_SEED = "__event_authority";
const GLOBAL_VOLUME_SEED = "global_volume_accumulator";
const USER_VOLUME_SEED = "user_volume_accumulator";
// Mayhem mode constants (Breaking change Nov 11, 2025)
const MAYHEM_PROGRAM_ID = new web3_js.PublicKey("MAyhSmzXzV1pTf7LsNkrNwkWKTo4ougAJ1PPg47MD4e");
const MAYHEM_FEE_RECIPIENT = new web3_js.PublicKey("GesfTA3X2arioaHp8bbKdjG9vJtskViWACZoYvxp4twS");
const MAYHEM_STATE_SEED = "mayhem-state";
const GLOBAL_PARAMS_SEED = "global-params";
const SOL_VAULT_SEED = "sol-vault";
// Token program constants
const TOKEN_2022_PROGRAM_ID = new web3_js.PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
const LEGACY_TOKEN_PROGRAM_ID = new web3_js.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const PUMP_PROGRAM_ID = new web3_js.PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");
const PUMP_FEE_PROGRAM_ID = new web3_js.PublicKey("pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ");
const DEFAULT_DECIMALS = 6;
const DEFAULT_COMMITMENT = "finalized";
const DEFAULT_FINALITY = "finalized";
const SLOT_ENDPOINT_BY_REGION = {
    [pumpFun_types.Region.Frankfurt]: "de1.0slot.trade",
    [pumpFun_types.Region.NY]: "ny1.0slot.trade",
    [pumpFun_types.Region.Tokyo]: "jp.0slot.trade",
    [pumpFun_types.Region.Amsterdam]: "ams1.0slot.trade",
    [pumpFun_types.Region.LosAngeles]: "la1.0slot.trade",
};
const ASTRA_ENDPOINT_BY_REGION = {
    [pumpFun_types.Region.Frankfurt]: "fr.gateway.astralane.io",
    [pumpFun_types.Region.NY]: "ny.gateway.astralane.io",
    [pumpFun_types.Region.Tokyo]: "jp.gateway.astralane.io",
    [pumpFun_types.Region.Amsterdam]: "ams.gateway.astralane.io",
};
const NODE1_ENDPOINT_BY_REGION = {
    [pumpFun_types.Region.NY]: "ny.node1.me",
    [pumpFun_types.Region.Tokyo]: "ny.node1.me",
    [pumpFun_types.Region.Amsterdam]: "ams.node1.me",
    [pumpFun_types.Region.Frankfurt]: "fra.node1.me",
};
const NEXTBLOCK_ENDPOINT_BY_REGION = {
    [pumpFun_types.Region.Tokyo]: "tokyo.nextblock.io",
    [pumpFun_types.Region.Frankfurt]: "fra.nextblock.io",
    [pumpFun_types.Region.NY]: "ny.nextblock.io",
};
const getHealthBody = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "getHealth",
});

exports.ASTRA_ENDPOINT_BY_REGION = ASTRA_ENDPOINT_BY_REGION;
exports.BONDING_CURVE_SEED = BONDING_CURVE_SEED;
exports.DEFAULT_COMMITMENT = DEFAULT_COMMITMENT;
exports.DEFAULT_DECIMALS = DEFAULT_DECIMALS;
exports.DEFAULT_FINALITY = DEFAULT_FINALITY;
exports.EVENT_AUTHORITY_SEED = EVENT_AUTHORITY_SEED;
exports.GLOBAL_ACCOUNT_SEED = GLOBAL_ACCOUNT_SEED;
exports.GLOBAL_PARAMS_SEED = GLOBAL_PARAMS_SEED;
exports.GLOBAL_VOLUME_SEED = GLOBAL_VOLUME_SEED;
exports.LEGACY_TOKEN_PROGRAM_ID = LEGACY_TOKEN_PROGRAM_ID;
exports.MAYHEM_FEE_RECIPIENT = MAYHEM_FEE_RECIPIENT;
exports.MAYHEM_PROGRAM_ID = MAYHEM_PROGRAM_ID;
exports.MAYHEM_STATE_SEED = MAYHEM_STATE_SEED;
exports.METADATA_SEED = METADATA_SEED;
exports.MINT_AUTHORITY_SEED = MINT_AUTHORITY_SEED;
exports.MPL_TOKEN_METADATA_PROGRAM_ID = MPL_TOKEN_METADATA_PROGRAM_ID;
exports.NEXTBLOCK_ENDPOINT_BY_REGION = NEXTBLOCK_ENDPOINT_BY_REGION;
exports.NODE1_ENDPOINT_BY_REGION = NODE1_ENDPOINT_BY_REGION;
exports.PUMP_FEE_PROGRAM_ID = PUMP_FEE_PROGRAM_ID;
exports.PUMP_PROGRAM_ID = PUMP_PROGRAM_ID;
exports.SLOT_ENDPOINT_BY_REGION = SLOT_ENDPOINT_BY_REGION;
exports.SOL_VAULT_SEED = SOL_VAULT_SEED;
exports.TOKEN_2022_PROGRAM_ID = TOKEN_2022_PROGRAM_ID;
exports.USER_VOLUME_SEED = USER_VOLUME_SEED;
exports.getHealthBody = getHealthBody;
//# sourceMappingURL=pumpFun.consts.cjs.map
