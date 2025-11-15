'use strict';

var web3_js = require('@solana/web3.js');
var pumpFun_consts = require('../pumpFun.consts.cjs');
var slippage = require('../slippage.cjs');
var tx = require('../tx.cjs');
var AgentRegistry = require('../AgentRegistry.cjs');

class NodeOneModule {
    sdk;
    key;
    constructor(sdk, region, key) {
        this.sdk = sdk;
        AgentRegistry.default.registerInConfig("node", region);
        this.key = key;
    }
    NODE_ONE_ACCOUNTS = [
        new web3_js.PublicKey("node1PqAa3BWWzUnTHVbw8NJHC874zn9ngAkXjgWEej"),
        new web3_js.PublicKey("node1UzzTxAAeBTpfZkQPJXBAqixsbdth11ba1NXLBG"),
        new web3_js.PublicKey("node1Qm1bV4fwYnCurP8otJ9s5yrkPq7SPZ5uhj3Tsv"),
        new web3_js.PublicKey("node1PUber6SFmSQgvf2ECmXsHP5o3boRSGhvJyPMX1"),
        new web3_js.PublicKey("node1AyMbeqiVN6eoQzEAwCA6Pk826hrdqdAHR7cdJ3"),
        new web3_js.PublicKey("node1YtWCoTwwVYTFLfS19zquRQzYX332hs1HEuRBjC"),
        new web3_js.PublicKey("node1FdMPnJBN7QTuhzNw3VS823nxFuDTizrrbcEqzp"),
    ];
    getRandomAccount() {
        const randomIndex = Math.floor(Math.random() * this.NODE_ONE_ACCOUNTS.length);
        return this.NODE_ONE_ACCOUNTS[randomIndex];
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
        return await AgentRegistry.default.callUpstream("node", "/ping", {
            method: "GET",
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
        return await AgentRegistry.default.callUpstream("node", `/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(txbody),
                "api-key": this.key,
            },
            body: txbody,
        });
    }
}

exports.NodeOneModule = NodeOneModule;
//# sourceMappingURL=NodeOneModule.cjs.map
