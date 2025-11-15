import { PumpFunSDK } from "../PumpFunSDK.js";
import { Commitment, Keypair, PublicKey } from "@solana/web3.js";
import { PriorityFee, TransactionResult } from "../pumpFun.types.js";
export declare class JitoModule {
    private sdk;
    private client;
    constructor(sdk: PumpFunSDK, endpoint?: string, authKeypair?: Keypair);
    buyJito(buyer: Keypair, mint: PublicKey, buyAmountSol: bigint, slippageBasisPoints?: bigint, jitoTip?: number, priorityFees?: PriorityFee, commitment?: Commitment): Promise<TransactionResult>;
    sellJito(seller: Keypair, mint: PublicKey, sellTokenAmount: bigint, slippageBasisPoints?: bigint, jitoTip?: number, priorityFees?: PriorityFee, commitment?: Commitment): Promise<TransactionResult>;
    private addJitoTip;
    private sendJitoTx;
}
//# sourceMappingURL=JitoModule.d.ts.map