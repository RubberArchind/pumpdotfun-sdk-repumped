import { PublicKey } from "@solana/web3.js";
import { PumpFunSDK } from "../PumpFunSDK.js";
export declare class PdaModule {
    private sdk;
    constructor(sdk: PumpFunSDK);
    getCreatorVaultPda(creator: PublicKey): PublicKey;
    getGlobalAccountPda(): PublicKey;
    getEventAuthorityPda(): PublicKey;
    getBondingCurvePDA(mint: PublicKey): PublicKey;
    getMintAuthorityPDA(): PublicKey;
    getPumpFeeConfigPda(): PublicKey;
    getMetadataPDA(mint: PublicKey): PublicKey;
    getGlobalVolumeAccumulatorPda(): PublicKey;
    getUserVolumeAccumulatorPda(user: PublicKey): PublicKey;
    getMayhemStatePda(mint: PublicKey): PublicKey;
    getGlobalParamsPda(): PublicKey;
    getSolVaultPda(): PublicKey;
    getMayhemTokenVaultPda(mint: PublicKey): PublicKey;
}
//# sourceMappingURL=PdaModule.d.ts.map