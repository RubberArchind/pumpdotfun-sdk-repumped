import { searcherClient } from 'jito-ts/dist/sdk/block-engine/searcher.js';
import { Transaction, SystemProgram } from '@solana/web3.js';
import { DEFAULT_COMMITMENT } from '../pumpFun.consts.mjs';
import { calculateWithSlippageBuy, calculateWithSlippageSell } from '../slippage.mjs';
import { buildSignedTx } from '../tx.mjs';
import { getRandomJitoTipAccount } from './utils.mjs';
import { Bundle } from 'jito-ts/dist/sdk/block-engine/types.js';

class JitoModule {
    sdk;
    client;
    constructor(sdk, endpoint, authKeypair) {
        this.sdk = sdk;
        if (!endpoint) {
            throw new Error("Jito endpoint is required");
        }
        this.client = searcherClient(endpoint, authKeypair);
    }
    async buyJito(buyer, mint, buyAmountSol, slippageBasisPoints = 500n, jitoTip = 500000, priorityFees, commitment = DEFAULT_COMMITMENT) {
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
        this.addJitoTip(buyer, transaction, jitoTip);
        const signedTx = await buildSignedTx(priorityFees, transaction, this.sdk.connection, buyer.publicKey, commitment, [buyer]);
        return await this.sendJitoTx(signedTx);
    }
    async sellJito(seller, mint, sellTokenAmount, slippageBasisPoints = 500n, jitoTip = 500000, priorityFees, commitment = DEFAULT_COMMITMENT) {
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
        this.addJitoTip(seller, transaction, jitoTip);
        const signedTx = await buildSignedTx(priorityFees, transaction, this.sdk.connection, seller.publicKey, commitment, [seller]);
        return await this.sendJitoTx(signedTx);
    }
    addJitoTip(buyer, transaction, jitoTip = 500000) {
        if (jitoTip <= 0) {
            return transaction;
        }
        const jitoTipAccount = getRandomJitoTipAccount();
        const jitoTipInstruction = SystemProgram.transfer({
            fromPubkey: buyer.publicKey,
            toPubkey: jitoTipAccount,
            lamports: jitoTip,
        });
        transaction.add(jitoTipInstruction);
        return transaction;
    }
    async sendJitoTx(tx) {
        const b = new Bundle([tx], 1);
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

export { JitoModule };
//# sourceMappingURL=JitoModule.mjs.map
