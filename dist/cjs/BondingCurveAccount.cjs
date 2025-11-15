'use strict';

var borsh = require('@coral-xyz/borsh');
var web3_js = require('@solana/web3.js');

class BondingCurveAccount {
    discriminator;
    virtualTokenReserves;
    virtualSolReserves;
    realTokenReserves;
    realSolReserves;
    tokenTotalSupply;
    complete;
    creator;
    isMayhemMode;
    constructor(discriminator, virtualTokenReserves, virtualSolReserves, realTokenReserves, realSolReserves, tokenTotalSupply, complete, creator, isMayhemMode = false) {
        this.discriminator = discriminator;
        this.virtualTokenReserves = virtualTokenReserves;
        this.virtualSolReserves = virtualSolReserves;
        this.realTokenReserves = realTokenReserves;
        this.realSolReserves = realSolReserves;
        this.tokenTotalSupply = tokenTotalSupply;
        this.complete = complete;
        this.creator = creator;
        this.isMayhemMode = isMayhemMode;
    }
    getBuyPrice(globalAccount, feeConfig, amount) {
        if (this.complete) {
            throw new Error("Curve is complete");
        }
        if (amount <= 0n) {
            return 0n;
        }
        if (this.virtualTokenReserves === 0n) {
            return 0n;
        }
        const { protocolFeeBps, creatorFeeBps } = feeConfig.computeFeesBps({
            global: globalAccount,
            virtualSolReserves: this.virtualSolReserves,
            virtualTokenReserves: this.virtualTokenReserves,
        });
        const totalFeeBasisPoints = protocolFeeBps +
            (!web3_js.PublicKey.default.equals(this.creator) ? creatorFeeBps : 0n);
        const inputAmount = (amount * 10000n) / (totalFeeBasisPoints + 10000n);
        const tokensReceived = this.getBuyTokenAmountFromSolAmountQuote({
            inputAmount,
            virtualTokenReserves: this.virtualTokenReserves,
            virtualSolReserves: this.virtualSolReserves,
        });
        return tokensReceived < this.realTokenReserves
            ? tokensReceived
            : this.realTokenReserves;
    }
    getBuyTokenAmountFromSolAmountQuote({ inputAmount, virtualTokenReserves, virtualSolReserves, }) {
        return ((inputAmount * virtualTokenReserves) / (virtualSolReserves + inputAmount));
    }
    getSellSolAmountFromTokenAmountQuote({ inputAmount, virtualTokenReserves, virtualSolReserves, }) {
        return ((inputAmount * virtualSolReserves) / (virtualTokenReserves + inputAmount));
    }
    getSellPrice(globalAccount, feeConfig, amount) {
        if (this.complete) {
            throw new Error("Curve is complete");
        }
        if (amount <= 0n) {
            return 0n;
        }
        if (this.virtualTokenReserves === 0n) {
            return 0n;
        }
        const solCost = this.getSellSolAmountFromTokenAmountQuote({
            inputAmount: amount,
            virtualTokenReserves: this.virtualTokenReserves,
            virtualSolReserves: this.virtualSolReserves,
        });
        const fee = feeConfig.getFee({
            global: globalAccount,
            bondingCurve: this,
            amount: solCost,
            isNewBondingCurve: false,
        });
        return solCost - fee;
    }
    getMarketCapSOL() {
        if (this.virtualTokenReserves === 0n) {
            return 0n;
        }
        return ((this.tokenTotalSupply * this.virtualSolReserves) /
            this.virtualTokenReserves);
    }
    getFinalMarketCapSOL(mintSupply) {
        return (this.virtualSolReserves * mintSupply) / this.virtualTokenReserves;
    }
    static fromBuffer(buffer) {
        const structure = borsh.struct([
            borsh.u64("discriminator"),
            borsh.u64("virtualTokenReserves"),
            borsh.u64("virtualSolReserves"),
            borsh.u64("realTokenReserves"),
            borsh.u64("realSolReserves"),
            borsh.u64("tokenTotalSupply"),
            borsh.bool("complete"),
            borsh.publicKey("creator"),
            borsh.bool("isMayhemMode"),
        ]);
        let value = structure.decode(buffer);
        return new BondingCurveAccount(BigInt(value.discriminator), BigInt(value.virtualTokenReserves), BigInt(value.virtualSolReserves), BigInt(value.realTokenReserves), BigInt(value.realSolReserves), BigInt(value.tokenTotalSupply), value.complete, value.creator, value.isMayhemMode);
    }
}

exports.BondingCurveAccount = BondingCurveAccount;
//# sourceMappingURL=BondingCurveAccount.cjs.map
