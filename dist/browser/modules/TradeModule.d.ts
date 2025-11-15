import { Keypair, Commitment, Finality, Transaction, PublicKey } from "@solana/web3.js";
import { CreateTokenMetadata, PriorityFee, TransactionResult } from "../pumpFun.types.js";
import { PumpFunSDK } from "../PumpFunSDK.js";
export declare class TradeModule {
    private sdk;
    constructor(sdk: PumpFunSDK);
    createAndBuy(creator: Keypair, mint: Keypair, metadata: CreateTokenMetadata, buyAmountSol: bigint, slippageBasisPoints?: bigint, priorityFees?: PriorityFee, commitment?: Commitment, finality?: Finality): Promise<TransactionResult>;
    buy(buyer: Keypair, mint: PublicKey, buyAmountSol: bigint, slippageBasisPoints?: bigint, priorityFees?: PriorityFee, commitment?: Commitment, finality?: Finality): Promise<TransactionResult>;
    getBuyInstructionsBySolAmount(buyer: PublicKey, mint: PublicKey, buyAmountSol: bigint, slippageBasisPoints?: bigint, commitment?: Commitment): Promise<Transaction>;
    buildBuyIx(buyer: PublicKey, mint: PublicKey, amount: bigint, maxSolCost: bigint, tx: Transaction, commitment: Commitment, shouldUseBuyerAsBonding: boolean): Promise<void>;
    getCreateInstructions(creator: PublicKey, name: string, symbol: string, uri: string, mint: Keypair): Promise<Transaction>;
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
    getCreateV2Instructions(creator: PublicKey, name: string, symbol: string, uri: string, mint: Keypair, isMayhemMode?: boolean): Promise<Transaction>;
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
    createAndBuyV2(creator: Keypair, mint: Keypair, metadata: CreateTokenMetadata, buyAmountSol: bigint, isMayhemMode?: boolean, slippageBasisPoints?: bigint, priorityFees?: PriorityFee, commitment?: Commitment, finality?: Finality): Promise<TransactionResult>;
    buildSellIx(seller: PublicKey, mint: PublicKey, tokenAmount: bigint, minSolOutput: bigint, tx: Transaction, commitment: Commitment): Promise<void>;
    sell(seller: Keypair, mint: PublicKey, sellTokenAmount: bigint, slippageBasisPoints?: bigint, priorityFees?: PriorityFee, commitment?: Commitment, finality?: Finality): Promise<TransactionResult>;
    getSellInstructionsByTokenAmount(seller: PublicKey, mint: PublicKey, sellTokenAmount: bigint, slippageBasisPoints?: bigint, commitment?: Commitment): Promise<Transaction>;
}
//# sourceMappingURL=TradeModule.d.ts.map