import { PublicKey } from "@solana/web3.js";
import { FeeConfig } from "./FeeConfig.js";
import { GlobalAccount } from "./globalAccount.js";
export declare class BondingCurveAccount {
    private static readonly BUY_AMOUNT_SAFETY_BPS;
    discriminator: bigint;
    virtualTokenReserves: bigint;
    virtualSolReserves: bigint;
    realTokenReserves: bigint;
    realSolReserves: bigint;
    tokenTotalSupply: bigint;
    complete: boolean;
    creator: PublicKey;
    isMayhemMode: boolean;
    isCashbackCoin: boolean;
    constructor(discriminator: bigint, virtualTokenReserves: bigint, virtualSolReserves: bigint, realTokenReserves: bigint, realSolReserves: bigint, tokenTotalSupply: bigint, complete: boolean, creator: PublicKey, isMayhemMode?: boolean, isCashbackCoin?: boolean);
    getBuyPrice(globalAccount: GlobalAccount, feeConfig: FeeConfig, amount: bigint): bigint;
    getBuyTokenAmountFromSolAmountQuote({ inputAmount, virtualTokenReserves, virtualSolReserves, }: {
        inputAmount: bigint;
        virtualTokenReserves: bigint;
        virtualSolReserves: bigint;
    }): bigint;
    getSellSolAmountFromTokenAmountQuote({ inputAmount, virtualTokenReserves, virtualSolReserves, }: {
        inputAmount: bigint;
        virtualTokenReserves: bigint;
        virtualSolReserves: bigint;
    }): bigint;
    getSellPrice(globalAccount: GlobalAccount, feeConfig: FeeConfig, amount: bigint): bigint;
    getMarketCapSOL(): bigint;
    getFinalMarketCapSOL(mintSupply: bigint): bigint;
    static fromBuffer(buffer: Buffer): BondingCurveAccount;
}
//# sourceMappingURL=BondingCurveAccount.d.ts.map