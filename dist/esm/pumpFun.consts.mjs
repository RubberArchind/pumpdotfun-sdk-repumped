import { PublicKey } from '@solana/web3.js';
import { Region } from './pumpFun.types.mjs';

const MPL_TOKEN_METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
const GLOBAL_ACCOUNT_SEED = "global";
const MINT_AUTHORITY_SEED = "mint-authority";
const BONDING_CURVE_SEED = "bonding-curve";
const METADATA_SEED = "metadata";
const EVENT_AUTHORITY_SEED = "__event_authority";
const GLOBAL_VOLUME_SEED = "global_volume_accumulator";
const USER_VOLUME_SEED = "user_volume_accumulator";
// Mayhem mode constants (Breaking change Nov 11, 2025)
const MAYHEM_PROGRAM_ID = new PublicKey("MAyhSmzXzV1pTf7LsNkrNwkWKTo4ougAJ1PPg47MD4e");
const MAYHEM_FEE_RECIPIENT = new PublicKey("GesfTA3X2arioaHp8bbKdjG9vJtskViWACZoYvxp4twS");
const MAYHEM_STATE_SEED = "mayhem-state";
const GLOBAL_PARAMS_SEED = "global-params";
const SOL_VAULT_SEED = "sol-vault";
// Token program constants
const TOKEN_2022_PROGRAM_ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
const LEGACY_TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const PUMP_PROGRAM_ID = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");
const PUMP_FEE_PROGRAM_ID = new PublicKey("pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ");
const DEFAULT_DECIMALS = 6;
const DEFAULT_COMMITMENT = "finalized";
const DEFAULT_FINALITY = "finalized";
const SLOT_ENDPOINT_BY_REGION = {
    [Region.Frankfurt]: "de1.0slot.trade",
    [Region.NY]: "ny1.0slot.trade",
    [Region.Tokyo]: "jp.0slot.trade",
    [Region.Amsterdam]: "ams1.0slot.trade",
    [Region.LosAngeles]: "la1.0slot.trade",
};
const ASTRA_ENDPOINT_BY_REGION = {
    [Region.Frankfurt]: "fr.gateway.astralane.io",
    [Region.NY]: "ny.gateway.astralane.io",
    [Region.Tokyo]: "jp.gateway.astralane.io",
    [Region.Amsterdam]: "ams.gateway.astralane.io",
};
const NODE1_ENDPOINT_BY_REGION = {
    [Region.NY]: "ny.node1.me",
    [Region.Tokyo]: "ny.node1.me",
    [Region.Amsterdam]: "ams.node1.me",
    [Region.Frankfurt]: "fra.node1.me",
};
const NEXTBLOCK_ENDPOINT_BY_REGION = {
    [Region.Tokyo]: "tokyo.nextblock.io",
    [Region.Frankfurt]: "fra.nextblock.io",
    [Region.NY]: "ny.nextblock.io",
};
const getHealthBody = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "getHealth",
});

export { ASTRA_ENDPOINT_BY_REGION, BONDING_CURVE_SEED, DEFAULT_COMMITMENT, DEFAULT_DECIMALS, DEFAULT_FINALITY, EVENT_AUTHORITY_SEED, GLOBAL_ACCOUNT_SEED, GLOBAL_PARAMS_SEED, GLOBAL_VOLUME_SEED, LEGACY_TOKEN_PROGRAM_ID, MAYHEM_FEE_RECIPIENT, MAYHEM_PROGRAM_ID, MAYHEM_STATE_SEED, METADATA_SEED, MINT_AUTHORITY_SEED, MPL_TOKEN_METADATA_PROGRAM_ID, NEXTBLOCK_ENDPOINT_BY_REGION, NODE1_ENDPOINT_BY_REGION, PUMP_FEE_PROGRAM_ID, PUMP_PROGRAM_ID, SLOT_ENDPOINT_BY_REGION, SOL_VAULT_SEED, TOKEN_2022_PROGRAM_ID, USER_VOLUME_SEED, getHealthBody };
//# sourceMappingURL=pumpFun.consts.mjs.map
