import BN from "bn.js";
import { getAssociatedTokenAddress, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Keypair,
  Commitment,
  Finality,
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import { GlobalAccount } from "../GlobalAccount.js";

import { 
  DEFAULT_COMMITMENT, 
  DEFAULT_FINALITY,
  MAYHEM_PROGRAM_ID,
} from "../pumpFun.consts.js";
import {
  CreateTokenMetadata,
  PriorityFee,
  TransactionResult,
} from "../pumpFun.types.js";
import { PumpFunSDK } from "../PumpFunSDK.js";
import {
  calculateWithSlippageBuy,
  calculateWithSlippageSell,
} from "../slippage.js";
import { sendTx } from "../tx.js";

export class TradeModule {
  constructor(private sdk: PumpFunSDK) {}

  async createAndBuy(
    creator: Keypair,
    mint: Keypair,
    metadata: CreateTokenMetadata,
    buyAmountSol: bigint,
    slippageBasisPoints: bigint = 500n,
    priorityFees?: PriorityFee,
    commitment: Commitment = DEFAULT_COMMITMENT,
    finality: Finality = DEFAULT_FINALITY
  ): Promise<TransactionResult> {
    const tokenMetadata = await this.sdk.token.createTokenMetadata(metadata);

    const createIx = await this.getCreateInstructions(
      creator.publicKey,
      metadata.name,
      metadata.symbol,
      tokenMetadata.metadataUri,
      mint
    );

    const transaction = new Transaction().add(createIx);

    if (buyAmountSol > 0n) {
      const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
      const buyAmount = globalAccount.getInitialBuyPrice(buyAmountSol);
      const buyAmountWithSlippage = calculateWithSlippageBuy(
        buyAmountSol,
        slippageBasisPoints
      );

      await this.buildBuyIx(
        creator.publicKey,
        mint.publicKey,
        buyAmount,
        buyAmountWithSlippage,
        transaction,
        commitment,
        true
      );
    }

    return await sendTx(
      this.sdk.connection,
      transaction,
      creator.publicKey,
      [creator, mint],
      priorityFees,
      commitment,
      finality
    );
  }

  async buy(
    buyer: Keypair,
    mint: PublicKey,
    buyAmountSol: bigint,
    slippageBasisPoints: bigint = 500n,
    priorityFees?: PriorityFee,
    commitment: Commitment = DEFAULT_COMMITMENT,
    finality: Finality = DEFAULT_FINALITY
  ): Promise<TransactionResult> {
    const bondingAccount = await this.sdk.token.getBondingCurveAccount(
      mint,
      commitment
    );
    if (!bondingAccount) {
      throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
    }

    const feeConfig = await this.sdk.token.getFeeConfig(commitment);
    const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
    const buyAmount = bondingAccount.getBuyPrice(
      globalAccount,
      feeConfig,
      buyAmountSol
    );
    const buyAmountWithSlippage = calculateWithSlippageBuy(
      buyAmountSol,
      slippageBasisPoints
    );

    const transaction = new Transaction();
    await this.buildBuyIx(
      buyer.publicKey,
      mint,
      buyAmount,
      buyAmountWithSlippage,
      transaction,
      commitment,
      false
    );

    return await sendTx(
      this.sdk.connection,
      transaction,
      buyer.publicKey,
      [buyer],
      priorityFees,
      commitment,
      finality
    );
  }

  async getBuyInstructionsBySolAmount(
    buyer: PublicKey,
    mint: PublicKey,
    buyAmountSol: bigint,
    slippageBasisPoints: bigint = 500n,
    commitment: Commitment = DEFAULT_COMMITMENT
  ): Promise<Transaction> {
    const bondingCurveAccount = await this.sdk.token.getBondingCurveAccount(
      mint,
      commitment
    );
    if (!bondingCurveAccount) {
      throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
    }

    const feeConfig = await this.sdk.token.getFeeConfig(commitment);
    const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
    const buyAmount = bondingCurveAccount.getBuyPrice(
      globalAccount,
      feeConfig,
      buyAmountSol
    );
    const buyAmountWithSlippage = calculateWithSlippageBuy(
      buyAmountSol,
      slippageBasisPoints
    );

    const transaction = new Transaction();
    await this.buildBuyIx(
      buyer,
      mint,
      buyAmount,
      buyAmountWithSlippage,
      transaction,
      commitment,
      false
    );

    return transaction;
  }

  async buildBuyIx(
    buyer: PublicKey,
    mint: PublicKey,
    amount: bigint,
    maxSolCost: bigint,
    tx: Transaction,
    commitment: Commitment,
    shouldUseBuyerAsBonding: boolean
  ): Promise<void> {
    const bondingCurve = this.sdk.pda.getBondingCurvePDA(mint);
    
    // IMPORTANT: Bonding curve ATA MUST use legacy TOKEN_PROGRAM_ID
    // The pump.fun program has tokenProgram hardcoded to legacy in the buy instruction
    const associatedBonding = 
      await this.sdk.token.createAssociatedTokenAccountIfNeededExplicit(
        buyer,
        bondingCurve,
        mint,
        tx,
        TOKEN_PROGRAM_ID, // Always use legacy token program for bonding curve
        true, // allowOwnerOffCurve - bonding curve is a PDA
        commitment
      );

    // User ATA uses the correct token program based on mint type (Token2022 vs legacy)
    const associatedUser =
      await this.sdk.token.createAssociatedTokenAccountIfNeeded(
        buyer,
        buyer,
        mint,
        tx,
        commitment,
        false // allowOwnerOffCurve - user is a wallet
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
  async getCreateInstructions(
    creator: PublicKey,
    name: string,
    symbol: string,
    uri: string,
    mint: Keypair
  ): Promise<Transaction> {
    const mintAuthority = this.sdk.pda.getMintAuthorityPDA();
    const bondingCurve = this.sdk.pda.getBondingCurvePDA(mint.publicKey);
    const associatedBonding = await getAssociatedTokenAddress(
      mint.publicKey,
      bondingCurve,
      true
    );
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

    return new Transaction().add(ix);
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
  async getCreateV2Instructions(
    creator: PublicKey,
    name: string,
    symbol: string,
    uri: string,
    mint: Keypair,
    isMayhemMode: boolean = false
  ): Promise<Transaction> {
    const mintAuthority = this.sdk.pda.getMintAuthorityPDA();
    const bondingCurve = this.sdk.pda.getBondingCurvePDA(mint.publicKey);
    
    // Use Token2022 for associated token account
    const associatedBonding = await getAssociatedTokenAddress(
      mint.publicKey,
      bondingCurve,
      true,
      TOKEN_2022_PROGRAM_ID
    );
    
    const global = this.sdk.pda.getGlobalAccountPda();
    const eventAuthority = this.sdk.pda.getEventAuthorityPda();

    // Mayhem mode accounts (indices 10-14)
    const mayhemProgramId = MAYHEM_PROGRAM_ID;
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
        systemProgram: PublicKey.default, // Will be set by Anchor
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
        mayhemProgramId,
        globalParams,
        solVault,
        mayhemState,
        mayhemTokenVault,
        eventAuthority,
      })
      .instruction();

    return new Transaction().add(ix);
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
  async createAndBuyV2(
    creator: Keypair,
    mint: Keypair,
    metadata: CreateTokenMetadata,
    buyAmountSol: bigint,
    isMayhemMode: boolean = false,
    slippageBasisPoints: bigint = 500n,
    priorityFees?: PriorityFee,
    commitment: Commitment = DEFAULT_COMMITMENT,
    finality: Finality = DEFAULT_FINALITY
  ): Promise<TransactionResult> {
    const tokenMetadata = await this.sdk.token.createTokenMetadata(metadata);

    const createIx = await this.getCreateV2Instructions(
      creator.publicKey,
      metadata.name,
      metadata.symbol,
      tokenMetadata.metadataUri,
      mint,
      isMayhemMode
    );

    const transaction = new Transaction().add(createIx);

    if (buyAmountSol > 0n) {
      const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
      const buyAmount = globalAccount.getInitialBuyPrice(buyAmountSol);
      const buyAmountWithSlippage = calculateWithSlippageBuy(
        buyAmountSol,
        slippageBasisPoints
      );

      await this.buildBuyIx(
        creator.publicKey,
        mint.publicKey,
        buyAmount,
        buyAmountWithSlippage,
        transaction,
        commitment,
        true
      );
    }

    return await sendTx(
      this.sdk.connection,
      transaction,
      creator.publicKey,
      [creator, mint],
      priorityFees,
      commitment,
      finality
    );
  }

  async buildSellIx(
    seller: PublicKey,
    mint: PublicKey,
    tokenAmount: bigint,
    minSolOutput: bigint,
    tx: Transaction,
    commitment: Commitment
  ): Promise<void> {
    const bondingCurve = this.sdk.pda.getBondingCurvePDA(mint);
    
    // IMPORTANT: Bonding curve ATA MUST use legacy TOKEN_PROGRAM_ID
    // The pump.fun program has tokenProgram hardcoded to legacy in the sell instruction
    const associatedBonding = 
      await this.sdk.token.createAssociatedTokenAccountIfNeededExplicit(
        seller,
        bondingCurve,
        mint,
        tx,
        TOKEN_PROGRAM_ID, // Always use legacy token program for bonding curve
        true, // allowOwnerOffCurve - bonding curve is a PDA
        commitment
      );

    // User ATA uses the correct token program based on mint type (Token2022 vs legacy)
    const associatedUser =
      await this.sdk.token.createAssociatedTokenAccountIfNeeded(
        seller,
        seller,
        mint,
        tx,
        commitment,
        false // allowOwnerOffCurve - user is a wallet
      );

    const globalPda = this.sdk.pda.getGlobalAccountPda();
    const globalBuf = await this.sdk.connection.getAccountInfo(
      globalPda,
      commitment
    );
    const feeRecipient = GlobalAccount.fromBuffer(globalBuf!.data).feeRecipient;

    const bondingCreator = await this.sdk.token.getBondingCurveCreator(
      bondingCurve,
      commitment
    );
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

  async sell(
    seller: Keypair,
    mint: PublicKey,
    sellTokenAmount: bigint,
    slippageBasisPoints: bigint = 500n,
    priorityFees?: PriorityFee,
    commitment: Commitment = DEFAULT_COMMITMENT,
    finality: Finality = DEFAULT_FINALITY
  ): Promise<TransactionResult> {
    const bondingAccount = await this.sdk.token.getBondingCurveAccount(
      mint,
      commitment
    );
    if (!bondingAccount)
      throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);

    const globalAccount = await this.sdk.token.getGlobalAccount(commitment);

    const feeConfig = await this.sdk.token.getFeeConfig(commitment);

    const minSolOutput = bondingAccount.getSellPrice(
      globalAccount,
      feeConfig,
      sellTokenAmount
    );
    let sellAmountWithSlippage = calculateWithSlippageSell(
      minSolOutput,
      slippageBasisPoints
    );
    if (sellAmountWithSlippage < 1n) sellAmountWithSlippage = 1n;

    const transaction = new Transaction();
    await this.buildSellIx(
      seller.publicKey,
      mint,
      sellTokenAmount,
      sellAmountWithSlippage,
      transaction,
      commitment
    );

    return await sendTx(
      this.sdk.connection,
      transaction,
      seller.publicKey,
      [seller],
      priorityFees,
      commitment,
      finality
    );
  }

  async getSellInstructionsByTokenAmount(
    seller: PublicKey,
    mint: PublicKey,
    sellTokenAmount: bigint,
    slippageBasisPoints: bigint = 500n,
    commitment: Commitment = DEFAULT_COMMITMENT
  ): Promise<Transaction> {
    const bondingAccount = await this.sdk.token.getBondingCurveAccount(
      mint,
      commitment
    );
    if (!bondingAccount)
      throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);

    const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
    const feeConfig = await this.sdk.token.getFeeConfig(commitment);

    const minSolOutput = bondingAccount.getSellPrice(
      globalAccount,
      feeConfig,
      sellTokenAmount
    );
    let sellAmountWithSlippage = calculateWithSlippageSell(
      minSolOutput,
      slippageBasisPoints
    );
    if (sellAmountWithSlippage < 1n) sellAmountWithSlippage = 1n;

    const transaction = new Transaction();
    await this.buildSellIx(
      seller,
      mint,
      sellTokenAmount,
      sellAmountWithSlippage,
      transaction,
      commitment
    );
    return transaction;
  }
}
