'use strict';

var BN = require('bn.js');
var splToken = require('@solana/spl-token');
var web3_js = require('@solana/web3.js');
var GlobalAccount = require('../GlobalAccount.cjs');
var pumpFun_consts = require('../pumpFun.consts.cjs');
var slippage = require('../slippage.cjs');
var tx = require('../tx.cjs');

class TradeModule {
    sdk;
    constructor(sdk) {
        this.sdk = sdk;
    }
    async createAndBuy(creator, mint, metadata, buyAmountSol, slippageBasisPoints = 500n, priorityFees, commitment = pumpFun_consts.DEFAULT_COMMITMENT, finality = pumpFun_consts.DEFAULT_FINALITY) {
        const tokenMetadata = await this.sdk.token.createTokenMetadata(metadata);
        const createIx = await this.getCreateInstructions(creator.publicKey, metadata.name, metadata.symbol, tokenMetadata.metadataUri, mint);
        const transaction = new web3_js.Transaction().add(createIx);
        if (buyAmountSol > 0n) {
            const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
            const buyAmount = globalAccount.getInitialBuyPrice(buyAmountSol);
            const buyAmountWithSlippage = slippage.calculateWithSlippageBuy(buyAmountSol, slippageBasisPoints);
            await this.buildBuyIx(creator.publicKey, mint.publicKey, buyAmount, buyAmountWithSlippage, transaction, commitment, true);
        }
        return await tx.sendTx(this.sdk.connection, transaction, creator.publicKey, [creator, mint], priorityFees, commitment, finality);
    }
    async buy(buyer, mint, buyAmountSol, slippageBasisPoints = 500n, priorityFees, commitment = pumpFun_consts.DEFAULT_COMMITMENT, finality = pumpFun_consts.DEFAULT_FINALITY) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount) {
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        }
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const buyAmount = bondingAccount.getBuyPrice(globalAccount, feeConfig, buyAmountSol);
        const buyAmountWithSlippage = slippage.calculateWithSlippageBuy(buyAmountSol, slippageBasisPoints);
        const transaction = new web3_js.Transaction();
        await this.buildBuyIx(buyer.publicKey, mint, buyAmount, buyAmountWithSlippage, transaction, commitment, false);
        return await tx.sendTx(this.sdk.connection, transaction, buyer.publicKey, [buyer], priorityFees, commitment, finality);
    }
    async getBuyInstructionsBySolAmount(buyer, mint, buyAmountSol, slippageBasisPoints = 500n, commitment = pumpFun_consts.DEFAULT_COMMITMENT) {
        const bondingCurveAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingCurveAccount) {
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        }
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const buyAmount = bondingCurveAccount.getBuyPrice(globalAccount, feeConfig, buyAmountSol);
        const buyAmountWithSlippage = slippage.calculateWithSlippageBuy(buyAmountSol, slippageBasisPoints);
        const transaction = new web3_js.Transaction();
        await this.buildBuyIx(buyer, mint, buyAmount, buyAmountWithSlippage, transaction, commitment, false);
        return transaction;
    }
    async buildBuyIx(buyer, mint, amount, maxSolCost, tx, commitment, shouldUseBuyerAsBonding) {
        const bondingCurve = this.sdk.pda.getBondingCurvePDA(mint);
        // CRITICAL: Buy instruction has tokenProgram HARDCODED to legacy in IDL
        // We MUST use legacy TOKEN_PROGRAM_ID for both ATAs, even for Token2022 mints
        const associatedBonding = await splToken.getAssociatedTokenAddress(mint, bondingCurve, true, // allowOwnerOffCurve
        splToken.TOKEN_PROGRAM_ID // Must be legacy for buy
        );
        const associatedUser = await splToken.getAssociatedTokenAddress(mint, buyer, false, splToken.TOKEN_PROGRAM_ID // Must be legacy for buy
        );
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const globalAccountPDA = this.sdk.pda.getGlobalAccountPda();
        const bondingCreator = shouldUseBuyerAsBonding
            ? this.sdk.pda.getCreatorVaultPda(buyer)
            : await this.sdk.token.getBondingCurveCreator(bondingCurve, commitment);
        const creatorVault = shouldUseBuyerAsBonding
            ? bondingCreator
            : this.sdk.pda.getCreatorVaultPda(bondingCreator);
        const eventAuthority = this.sdk.pda.getEventAuthorityPda();
        const ix = await this.sdk.program.methods
            .buy(new BN(amount.toString()), new BN(maxSolCost.toString()))
            .accounts({
            global: globalAccountPDA,
            feeRecipient: globalAccount.feeRecipient,
            mint,
            bondingCurve,
            associatedBondingCurve: associatedBonding,
            associatedUser,
            user: buyer,
            creatorVault,
            eventAuthority,
            globalVolumeAccumulator: this.sdk.pda.getGlobalVolumeAccumulatorPda(),
            userVolumeAccumulator: this.sdk.pda.getUserVolumeAccumulatorPda(buyer),
            feeConfig: this.sdk.pda.getPumpFeeConfigPda(),
        })
            .instruction();
        tx.add(ix);
    }
    //create token instructions (legacy - uses Metaplex metadata)
    async getCreateInstructions(creator, name, symbol, uri, mint) {
        const mintAuthority = this.sdk.pda.getMintAuthorityPDA();
        const bondingCurve = this.sdk.pda.getBondingCurvePDA(mint.publicKey);
        const associatedBonding = await splToken.getAssociatedTokenAddress(mint.publicKey, bondingCurve, true);
        const global = this.sdk.pda.getGlobalAccountPda();
        const metadata = this.sdk.pda.getMetadataPDA(mint.publicKey);
        const eventAuthority = this.sdk.pda.getEventAuthorityPda();
        const ix = await this.sdk.program.methods
            .create(name, symbol, uri, creator)
            .accounts({
            mint: mint.publicKey,
            mintAuthority,
            bondingCurve,
            associatedBondingCurve: associatedBonding,
            global,
            metadata,
            user: creator,
            eventAuthority,
        })
            .instruction();
        return new web3_js.Transaction().add(ix);
    }
    /**
     * Create token instructions using Token2022 and mayhem mode support
     * Breaking change introduced Nov 11, 2025
     * @param creator Creator public key
     * @param name Token name
     * @param symbol Token symbol
     * @param uri Metadata URI
     * @param mint Mint keypair
     * @param isMayhemMode Enable mayhem mode (uses different fee recipient)
     * @returns Transaction with createV2 instruction
     */
    async getCreateV2Instructions(creator, name, symbol, uri, mint, isMayhemMode = false) {
        const mintAuthority = this.sdk.pda.getMintAuthorityPDA();
        const bondingCurve = this.sdk.pda.getBondingCurvePDA(mint.publicKey);
        // CRITICAL: Even though this is Token2022 createV2, the bonding curve ATA
        // MUST use legacy TOKEN_PROGRAM_ID because buy/sell instructions require it
        const associatedBonding = await splToken.getAssociatedTokenAddress(mint.publicKey, bondingCurve, true, splToken.TOKEN_PROGRAM_ID // Must be legacy for trading compatibility
        );
        const global = this.sdk.pda.getGlobalAccountPda();
        const eventAuthority = this.sdk.pda.getEventAuthorityPda();
        // Mayhem mode accounts (indices 10-14)
        const mayhemProgramId = pumpFun_consts.MAYHEM_PROGRAM_ID;
        const globalParams = this.sdk.pda.getGlobalParamsPda();
        const solVault = this.sdk.pda.getSolVaultPda();
        const mayhemState = this.sdk.pda.getMayhemStatePda(mint.publicKey);
        const mayhemTokenVault = this.sdk.pda.getMayhemTokenVaultPda(mint.publicKey);
        const ix = await this.sdk.program.methods
            .createV2(name, symbol, uri, creator, isMayhemMode)
            .accounts({
            mint: mint.publicKey,
            mintAuthority,
            bondingCurve,
            associatedBondingCurve: associatedBonding,
            global,
            user: creator,
            systemProgram: web3_js.PublicKey.default, // Will be set by Anchor
            tokenProgram: splToken.TOKEN_2022_PROGRAM_ID,
            associatedTokenProgram: new web3_js.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
            mayhemProgramId,
            globalParams,
            solVault,
            mayhemState,
            mayhemTokenVault,
            eventAuthority,
        })
            .instruction();
        return new web3_js.Transaction().add(ix);
    }
    /**
     * Create and buy using Token2022 with optional mayhem mode
     * @param creator Creator keypair
     * @param mint Mint keypair
     * @param metadata Token metadata
     * @param buyAmountSol Amount of SOL to spend on initial buy
     * @param isMayhemMode Enable mayhem mode
     * @param slippageBasisPoints Slippage tolerance in basis points
     * @param priorityFees Priority fees configuration
     * @param commitment Commitment level
     * @param finality Finality level
     * @returns Transaction result
     */
    async createAndBuyV2(creator, mint, metadata, buyAmountSol, isMayhemMode = false, slippageBasisPoints = 500n, priorityFees, commitment = pumpFun_consts.DEFAULT_COMMITMENT, finality = pumpFun_consts.DEFAULT_FINALITY) {
        const tokenMetadata = await this.sdk.token.createTokenMetadata(metadata);
        const createIx = await this.getCreateV2Instructions(creator.publicKey, metadata.name, metadata.symbol, tokenMetadata.metadataUri, mint, isMayhemMode);
        const transaction = new web3_js.Transaction().add(createIx);
        if (buyAmountSol > 0n) {
            const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
            const buyAmount = globalAccount.getInitialBuyPrice(buyAmountSol);
            const buyAmountWithSlippage = slippage.calculateWithSlippageBuy(buyAmountSol, slippageBasisPoints);
            await this.buildBuyIx(creator.publicKey, mint.publicKey, buyAmount, buyAmountWithSlippage, transaction, commitment, true);
        }
        return await tx.sendTx(this.sdk.connection, transaction, creator.publicKey, [creator, mint], priorityFees, commitment, finality);
    }
    async buildSellIx(seller, mint, tokenAmount, minSolOutput, tx, commitment) {
        const bondingCurve = this.sdk.pda.getBondingCurvePDA(mint);
        // CRITICAL: Sell instruction has tokenProgram HARDCODED to legacy in IDL
        // We MUST use legacy TOKEN_PROGRAM_ID for both ATAs, even for Token2022 mints
        // Jupiter works by transferring Token2022 → legacy ATA before selling
        const associatedBonding = await splToken.getAssociatedTokenAddress(mint, bondingCurve, true, // allowOwnerOffCurve
        splToken.TOKEN_PROGRAM_ID // Must be legacy for sell
        );
        const associatedUser = await splToken.getAssociatedTokenAddress(mint, seller, false, splToken.TOKEN_PROGRAM_ID // Must be legacy for sell
        );
        const globalPda = this.sdk.pda.getGlobalAccountPda();
        const globalBuf = await this.sdk.connection.getAccountInfo(globalPda, commitment);
        const feeRecipient = GlobalAccount.GlobalAccount.fromBuffer(globalBuf.data).feeRecipient;
        const bondingCreator = await this.sdk.token.getBondingCurveCreator(bondingCurve, commitment);
        const creatorVault = this.sdk.pda.getCreatorVaultPda(bondingCreator);
        const eventAuthority = this.sdk.pda.getEventAuthorityPda();
        const ix = await this.sdk.program.methods
            .sell(new BN(tokenAmount.toString()), new BN(minSolOutput.toString()))
            .accounts({
            global: globalPda,
            feeRecipient,
            mint,
            bondingCurve,
            associatedBondingCurve: associatedBonding,
            associatedUser,
            user: seller,
            creatorVault,
            eventAuthority,
            feeConfig: this.sdk.pda.getPumpFeeConfigPda(),
        })
            .instruction();
        tx.add(ix);
    }
    async sell(seller, mint, sellTokenAmount, slippageBasisPoints = 500n, priorityFees, commitment = pumpFun_consts.DEFAULT_COMMITMENT, finality = pumpFun_consts.DEFAULT_FINALITY) {
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
        await this.buildSellIx(seller.publicKey, mint, sellTokenAmount, sellAmountWithSlippage, transaction, commitment);
        return await tx.sendTx(this.sdk.connection, transaction, seller.publicKey, [seller], priorityFees, commitment, finality);
    }
    async getSellInstructionsByTokenAmount(seller, mint, sellTokenAmount, slippageBasisPoints = 500n, commitment = pumpFun_consts.DEFAULT_COMMITMENT) {
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
        await this.buildSellIx(seller, mint, sellTokenAmount, sellAmountWithSlippage, transaction, commitment);
        return transaction;
    }
}

exports.TradeModule = TradeModule;
//# sourceMappingURL=TradeModule.cjs.map
