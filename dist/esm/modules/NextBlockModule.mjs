import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { DEFAULT_COMMITMENT } from '../pumpFun.consts.mjs';
import { calculateWithSlippageBuy, calculateWithSlippageSell } from '../slippage.mjs';
import { buildSignedTx } from '../tx.mjs';
import AgentRegistry from '../AgentRegistry.mjs';

class NextBlockModule {
    sdk;
    key;
    constructor(sdk, region, key) {
        this.sdk = sdk;
        AgentRegistry.registerInConfig("nextBlock", region);
        this.key = key;
    }
    NEXT_BLOCK_ACCOUNTS = [
        new PublicKey("NextbLoCkVtMGcV47JzewQdvBpLqT9TxQFozQkN98pE"),
        new PublicKey("NexTbLoCkWykbLuB1NkjXgFWkX9oAtcoagQegygXXA2"),
        new PublicKey("NeXTBLoCKs9F1y5PJS9CKrFNNLU1keHW71rfh7KgA1X"),
        new PublicKey("NexTBLockJYZ7QD7p2byrUa6df8ndV2WSd8GkbWqfbb"),
        new PublicKey("neXtBLock1LeC67jYd1QdAa32kbVeubsfPNTJC1V5At"),
        new PublicKey("nEXTBLockYgngeRmRrjDV31mGSekVPqZoMGhQEZtPVG"),
        new PublicKey("NEXTbLoCkB51HpLBLojQfpyVAMorm3zzKg7w9NFdqid"),
        new PublicKey("nextBLoCkPMgmG8ZgJtABeScP35qLa2AMCNKntAP7Xc"),
    ];
    getRandomAccount() {
        const randomIndex = Math.floor(Math.random() * this.NEXT_BLOCK_ACCOUNTS.length);
        return this.NEXT_BLOCK_ACCOUNTS[randomIndex];
    }
    async buy(buyer, mint, buyAmountSol, slippageBasisPoints = 500n, tip = 500000, priorityFees, commitment = DEFAULT_COMMITMENT) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount) {
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        }
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const buyAmount = bondingAccount.getBuyPrice(globalAccount, feeConfig, buyAmountSol);
        const buyAmountWithSlippage = calculateWithSlippageBuy(buyAmountSol, slippageBasisPoints);
        const transaction = new Transaction();
        await this.sdk.trade.buildBuyIx(buyer.publicKey, mint, buyAmount, buyAmountWithSlippage, transaction, commitment, false);
        this.addTip(buyer, transaction, tip);
        const signedTx = await buildSignedTx(priorityFees, transaction, this.sdk.connection, buyer.publicKey, commitment, [buyer]);
        return await this.sendTransaction(signedTx);
    }
    async sell(seller, mint, sellTokenAmount, slippageBasisPoints = 500n, tip = 500000, priorityFees, commitment = DEFAULT_COMMITMENT) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount)
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const minSolOutput = bondingAccount.getSellPrice(globalAccount, feeConfig, sellTokenAmount);
        let sellAmountWithSlippage = calculateWithSlippageSell(minSolOutput, slippageBasisPoints);
        if (sellAmountWithSlippage < 1n)
            sellAmountWithSlippage = 1n;
        const transaction = new Transaction();
        await this.sdk.trade.buildSellIx(seller.publicKey, mint, sellTokenAmount, sellAmountWithSlippage, transaction, commitment);
        this.addTip(seller, transaction, tip);
        const signedTx = await buildSignedTx(priorityFees, transaction, this.sdk.connection, seller.publicKey, commitment, [seller]);
        return await this.sendTransaction(signedTx);
    }
    addTip(buyer, transaction, tip = 500000) {
        if (tip <= 0) {
            return transaction;
        }
        const tipAccount = this.getRandomAccount();
        const tipInstructions = SystemProgram.transfer({
            fromPubkey: buyer.publicKey,
            toPubkey: tipAccount,
            lamports: tip,
        });
        transaction.add(tipInstructions);
        return transaction;
    }
    async ping() {
        return await AgentRegistry.callUpstream("nextBlock", "/api/v2/submit", {
            method: "GET",
            headers: {
                Authorization: this.key,
            },
        });
    }
    async sendTransaction(vertionedTx) {
        const serealized = vertionedTx.serialize();
        const tx = Buffer.from(serealized).toString("base64");
        const txbody = JSON.stringify({ transaction: { content: tx } });
        return await AgentRegistry.callUpstream("nextBlock", `/api/v2/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(txbody),
                Authorization: this.key,
            },
            body: txbody,
        });
    }
}

export { NextBlockModule };
//# sourceMappingURL=NextBlockModule.mjs.map
