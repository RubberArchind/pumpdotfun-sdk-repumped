import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { DEFAULT_COMMITMENT, getHealthBody } from '../pumpFun.consts.mjs';
import { calculateWithSlippageBuy, calculateWithSlippageSell } from '../slippage.mjs';
import { buildSignedTx } from '../tx.mjs';
import AgentRegistry from '../AgentRegistry.mjs';

class SlotModule {
    sdk;
    key;
    constructor(sdk, region, key) {
        this.sdk = sdk;
        AgentRegistry.registerInConfig("slot", region);
        this.key = key;
    }
    SLOT_ACCOUNTS = [
        new PublicKey("Eb2KpSC8uMt9GmzyAEm5Eb1AAAgTjRaXWFjKyFXHZxF3"),
        new PublicKey("FCjUJZ1qozm1e8romw216qyfQMaaWKxWsuySnumVCCNe"),
        new PublicKey("ENxTEjSQ1YabmUpXAdCgevnHQ9MHdLv8tzFiuiYJqa13"),
        new PublicKey("6rYLG55Q9RpsPGvqdPNJs4z5WTxJVatMB8zV3WJhs5EK"),
        new PublicKey("Cix2bHfqPcKcM233mzxbLk14kSggUUiz2A87fJtGivXr"),
    ];
    getRandomAccount() {
        const randomIndex = Math.floor(Math.random() * this.SLOT_ACCOUNTS.length);
        return this.SLOT_ACCOUNTS[randomIndex];
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
        return await AgentRegistry.callUpstream("slot", `/?api-key=${this.key}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(getHealthBody),
            },
            body: getHealthBody,
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
        return await AgentRegistry.callUpstream("slot", `/?api-key=${this.key}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(txbody),
            },
            body: txbody,
        });
    }
}

export { SlotModule };
//# sourceMappingURL=SlotModule.mjs.map
