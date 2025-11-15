'use strict';

var web3_js = require('@solana/web3.js');
var pumpFun_consts = require('../pumpFun.consts.cjs');
var slippage = require('../slippage.cjs');
var tx = require('../tx.cjs');
var AgentRegistry = require('../AgentRegistry.cjs');

class AstraModule {
    sdk;
    key;
    constructor(sdk, region, key) {
        this.sdk = sdk;
        AgentRegistry.default.registerInConfig("astra", region);
        this.key = key;
    }
    ASTRA_ACCOUNTS = [
        new web3_js.PublicKey("astrazznxsGUhWShqgNtAdfrzP2G83DzcWVJDxwV9bF"),
        new web3_js.PublicKey("astra4uejePWneqNaJKuFFA8oonqCE1sqF6b45kDMZm"),
        new web3_js.PublicKey("astra9xWY93QyfG6yM8zwsKsRodscjQ2uU2HKNL5prk"),
        new web3_js.PublicKey("astraRVUuTHjpwEVvNBeQEgwYx9w9CFyfxjYoobCZhL"),
    ];
    getRandomAccount() {
        const randomIndex = Math.floor(Math.random() * this.ASTRA_ACCOUNTS.length);
        return this.ASTRA_ACCOUNTS[randomIndex];
    }
    async buy(buyer, mint, buyAmountSol, slippageBasisPoints = 500n, tip = 500000, priorityFees, commitment = pumpFun_consts.DEFAULT_COMMITMENT) {
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
        this.addTip(buyer, transaction, tip);
        const signedTx = await tx.buildSignedTx(priorityFees, transaction, this.sdk.connection, buyer.publicKey, commitment, [buyer]);
        return await this.sendTransaction(signedTx);
    }
    async sell(seller, mint, sellTokenAmount, slippageBasisPoints = 500n, tip = 500000, priorityFees, commitment = pumpFun_consts.DEFAULT_COMMITMENT) {
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
        this.addTip(seller, transaction, tip);
        const signedTx = await tx.buildSignedTx(priorityFees, transaction, this.sdk.connection, seller.publicKey, commitment, [seller]);
        return await this.sendTransaction(signedTx);
    }
    addTip(buyer, transaction, tip = 500000) {
        if (tip <= 0) {
            return transaction;
        }
        const tipAccount = this.getRandomAccount();
        const tipInstructions = web3_js.SystemProgram.transfer({
            fromPubkey: buyer.publicKey,
            toPubkey: tipAccount,
            lamports: tip,
        });
        transaction.add(tipInstructions);
        return transaction;
    }
    async ping() {
        return await AgentRegistry.default.callUpstream("astra", `/iris?api-key=${this.key}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(pumpFun_consts.getHealthBody),
            },
            body: pumpFun_consts.getHealthBody,
        });
    }
    async sendTransaction(vertionedTx) {
        const serealized = vertionedTx.serialize();
        const tx = Buffer.from(serealized).toString("base64");
        const UUID = crypto.randomUUID();
        const txbody = JSON.stringify({
            jsonrpc: "2.0",
            id: UUID,
            method: "sendTransaction",
            params: [tx, { encoding: "base64", skipPreflight: true, maxRetries: 0 }],
        });
        return await AgentRegistry.default.callUpstream("astra", `/iris?api-key=${this.key}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(txbody),
            },
            body: txbody,
        });
    }
}

exports.AstraModule = AstraModule;
//# sourceMappingURL=AstraModule.cjs.map
