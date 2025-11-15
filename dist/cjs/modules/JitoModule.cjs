'use strict';

var searcher_js = require('jito-ts/dist/sdk/block-engine/searcher.js');
var web3_js = require('@solana/web3.js');
var pumpFun_consts = require('../pumpFun.consts.cjs');
var slippage = require('../slippage.cjs');
var tx = require('../tx.cjs');
var utils = require('./utils.cjs');
var types_js = require('jito-ts/dist/sdk/block-engine/types.js');

class JitoModule {
    sdk;
    client;
    constructor(sdk, endpoint, authKeypair) {
        this.sdk = sdk;
        if (!endpoint) {
            throw new Error("Jito endpoint is required");
        }
        this.client = searcher_js.searcherClient(endpoint, authKeypair);
    }
    async buyJito(buyer, mint, buyAmountSol, slippageBasisPoints = 500n, jitoTip = 500000, priorityFees, commitment = pumpFun_consts.DEFAULT_COMMITMENT) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount) {
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        }
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const buyAmount = bondingAccount.getBuyPrice(globalAccount, feeConfig, buyAmountSol);
        const buyAmountWithSlippage = slippage.calculateWithSlippageBuy(buyAmountSol, slippageBasisPoints);
        const transaction = new web3_js.Transaction();
        await this.sdk.trade.buildBuyIx(buyer.publicKey, mint, buyAmount, buyAmountWithSlippage, transaction, commitment, false);
        this.addJitoTip(buyer, transaction, jitoTip);
        const signedTx = await tx.buildSignedTx(priorityFees, transaction, this.sdk.connection, buyer.publicKey, commitment, [buyer]);
        return await this.sendJitoTx(signedTx);
    }
    async sellJito(seller, mint, sellTokenAmount, slippageBasisPoints = 500n, jitoTip = 500000, priorityFees, commitment = pumpFun_consts.DEFAULT_COMMITMENT) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount)
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const minSolOutput = bondingAccount.getSellPrice(globalAccount, feeConfig, sellTokenAmount);
        let sellAmountWithSlippage = slippage.calculateWithSlippageSell(minSolOutput, slippageBasisPoints);
        if (sellAmountWithSlippage < 1n)
            sellAmountWithSlippage = 1n;
        const transaction = new web3_js.Transaction();
        await this.sdk.trade.buildSellIx(seller.publicKey, mint, sellTokenAmount, sellAmountWithSlippage, transaction, commitment);
        this.addJitoTip(seller, transaction, jitoTip);
        const signedTx = await tx.buildSignedTx(priorityFees, transaction, this.sdk.connection, seller.publicKey, commitment, [seller]);
        return await this.sendJitoTx(signedTx);
    }
    addJitoTip(buyer, transaction, jitoTip = 500000) {
        if (jitoTip <= 0) {
            return transaction;
        }
        const jitoTipAccount = utils.getRandomJitoTipAccount();
        const jitoTipInstruction = web3_js.SystemProgram.transfer({
            fromPubkey: buyer.publicKey,
            toPubkey: jitoTipAccount,
            lamports: jitoTip,
        });
        transaction.add(jitoTipInstruction);
        return transaction;
    }
    async sendJitoTx(tx) {
        const b = new types_js.Bundle([tx], 1);
        const res = await this.client.sendBundle(b);
        if (res.ok) {
            return {
                success: true,
                bundleId: res.value,
            };
        }
        return {
            success: false,
            error: res.error,
        };
    }
}

exports.JitoModule = JitoModule;
//# sourceMappingURL=JitoModule.cjs.map
