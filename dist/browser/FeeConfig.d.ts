import { PublicKey } from "@solana/web3.js";
import { BondingCurveAccount } from "./BondingCurveAccount.js";
import { GlobalAccount } from "./GlobalAccount.js";
import { BN } from "@coral-xyz/anchor";
export interface CalculatedFeesBps {
    protocolFeeBps: bigint;
    creatorFeeBps: bigint;
}
export interface CalculatedFees {
    protocolFee: bigint;
    creatorFee: bigint;
}
export interface FeeTier {
    marketCapLamportsThreshold: bigint;
    fees: Fees;
}
export interface Fees {
    lpFeeBps: bigint;
    protocolFeeBps: bigint;
    creatorFeeBps: bigint;
}
export interface FeeConfigAnchor {
    admin: PublicKey;
    flatFees: FeesAnchor;
    feeTiers: FeeTierAnchor[];
}
export interface FeeTierAnchor {
    marketCapLamportsThreshold: BN;
    fees: FeesAnchor;
}
export interface FeesAnchor {
    lpFeeBps: BN;
    protocolFeeBps: BN;
    creatorFeeBps: BN;
}
export declare class FeeConfig {
    discriminator: bigint;
    admin: PublicKey;
    flatFees: Fees;
    feeTiers: FeeTier[];
    constructor(discriminator: bigint, admin: PublicKey, flatFees: Fees, feeTiers: FeeTier[]);
    getFee({ global, bondingCurve, amount, isNewBondingCurve, }: {
        global: GlobalAccount;
        bondingCurve: BondingCurveAccount;
        amount: bigint;
        isNewBondingCurve: boolean;
    }): bigint;
    bondingCurveMarketCap({ mintSupply, virtualSolReserves, virtualTokenReserves, }: {
        mintSupply: bigint;
        virtualSolReserves: bigint;
        virtualTokenReserves: bigint;
    }): bigint;
    computeFeesBps({ global, virtualSolReserves, virtualTokenReserves, }: {
        global: GlobalAccount;
        virtualSolReserves: bigint;
        virtualTokenReserves: bigint;
    }): CalculatedFeesBps;
    calculateFeeTier({ feeTiers, marketCap, }: {
        feeTiers: FeeTier[];
        marketCap: bigint;
    }): Fees;
    fee(amount: bigint, feeBasisPoints: bigint): bigint;
    ceilDiv(a: bigint, b: bigint): bigint;
    static convert(base: FeeConfigAnchor): FeeConfig;
}
//# sourceMappingURL=FeeConfig.d.ts.map