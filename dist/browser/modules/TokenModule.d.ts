import { PublicKey, Transaction, Commitment } from "@solana/web3.js";
import { CreateTokenMetadata } from "../pumpFun.types.js";
import { PumpFunSDK } from "../PumpFunSDK.js";
import { BondingCurveAccount } from "../BondingCurveAccount.js";
import { GlobalAccount } from "../GlobalAccount.js";
import { FeeConfig } from "../FeeConfig.js";
export declare class TokenModule {
    private sdk;
    constructor(sdk: PumpFunSDK);
    createTokenMetadata(create: CreateTokenMetadata): Promise<any>;
    createAssociatedTokenAccountIfNeeded(payer: PublicKey, owner: PublicKey, mint: PublicKey, transaction: Transaction, commitment?: Commitment, allowOwnerOffCurve?: boolean): Promise<PublicKey>;
    /**
     * Create ATA with explicit token program (for cases where mint uses Token2022 but ATA must use legacy)
     */
    createAssociatedTokenAccountIfNeededExplicit(payer: PublicKey, owner: PublicKey, mint: PublicKey, transaction: Transaction, tokenProgramId: PublicKey, allowOwnerOffCurve?: boolean, commitment?: Commitment): Promise<PublicKey>;
    getBondingCurveAccount(mint: PublicKey, commitmentOrTokenProgram?: Commitment | PublicKey, commitment?: Commitment): Promise<BondingCurveAccount | null>;
    getGlobalAccount(commitment?: Commitment): Promise<GlobalAccount>;
    getFeeConfig(commitment?: Commitment): Promise<FeeConfig>;
    getBondingCurveCreator(bondingCurvePDA: PublicKey, commitment?: Commitment): Promise<PublicKey>;
}
//# sourceMappingURL=TokenModule.d.ts.map