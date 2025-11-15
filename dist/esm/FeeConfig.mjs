import { PublicKey } from '@solana/web3.js';

class FeeConfig {
    discriminator;
    admin;
    flatFees;
    feeTiers;
    constructor(discriminator, admin, flatFees, feeTiers) {
        this.discriminator = discriminator;
        this.admin = admin;
        this.flatFees = flatFees;
        this.feeTiers = feeTiers;
    }
    getFee({ global, bondingCurve, amount, isNewBondingCurve, }) {
        const { virtualSolReserves, virtualTokenReserves } = bondingCurve;
        const { protocolFeeBps, creatorFeeBps } = this.computeFeesBps({
            global,
            virtualSolReserves,
            virtualTokenReserves,
        });
        return (this.fee(amount, protocolFeeBps) +
            (isNewBondingCurve || !PublicKey.default.equals(bondingCurve.creator)
                ? this.fee(amount, creatorFeeBps)
                : 0n));
    }
    bondingCurveMarketCap({ mintSupply, virtualSolReserves, virtualTokenReserves, }) {
        if (virtualTokenReserves === 0n) {
            throw new Error("Division by zero: virtual token reserves cannot be zero");
        }
        return (virtualSolReserves * mintSupply) / virtualTokenReserves;
    }
    computeFeesBps({ global, virtualSolReserves, virtualTokenReserves, }) {
        const marketCap = this.bondingCurveMarketCap({
            mintSupply: global.tokenTotalSupply,
            virtualSolReserves,
            virtualTokenReserves,
        });
        return this.calculateFeeTier({
            feeTiers: this.feeTiers,
            marketCap,
        });
    }
    calculateFeeTier({ feeTiers, marketCap, }) {
        const firstTier = feeTiers[0];
        if (marketCap < firstTier.marketCapLamportsThreshold) {
            return firstTier.fees;
        }
        for (const tier of feeTiers.slice().reverse()) {
            if (marketCap >= tier.marketCapLamportsThreshold) {
                return tier.fees;
            }
        }
        return firstTier.fees;
    }
    fee(amount, feeBasisPoints) {
        return this.ceilDiv(amount * feeBasisPoints, 10000n);
    }
    ceilDiv(a, b) {
        return (a + (b - 1n)) / b;
    }
    static convert(base) {
        const flatFees = {
            lpFeeBps: BigInt(base.flatFees.lpFeeBps.toString()),
            protocolFeeBps: BigInt(base.flatFees.protocolFeeBps.toString()),
            creatorFeeBps: BigInt(base.flatFees.creatorFeeBps.toString()),
        };
        const feeTiers = base.feeTiers.map((tier) => ({
            marketCapLamportsThreshold: BigInt(tier.marketCapLamportsThreshold.toString()),
            fees: {
                lpFeeBps: BigInt(tier.fees.lpFeeBps.toString()),
                protocolFeeBps: BigInt(tier.fees.protocolFeeBps.toString()),
                creatorFeeBps: BigInt(tier.fees.creatorFeeBps.toString()),
            },
        }));
        return new FeeConfig(0n, // discriminator not available in FeeConfigAnchor
        base.admin, flatFees, feeTiers);
    }
}

export { FeeConfig };
//# sourceMappingURL=FeeConfig.mjs.map
