import { PumpFunSDK } from "../PumpFunSDK.js";
import { Commitment, Keypair, PublicKey, VersionedTransaction } from "@solana/web3.js";
import { PriorityFee, Region } from "../pumpFun.types.js";
export declare class NodeOneModule {
    private sdk;
    private key;
    constructor(sdk: PumpFunSDK, region: Region, key: string);
    NODE_ONE_ACCOUNTS: PublicKey[];
    private getRandomAccount;
    buy(buyer: Keypair, mint: PublicKey, buyAmountSol: bigint, slippageBasisPoints?: bigint, tip?: number, priorityFees?: PriorityFee, commitment?: Commitment): Promise<string>;
    sell(seller: Keypair, mint: PublicKey, sellTokenAmount: bigint, slippageBasisPoints?: bigint, tip?: number, priorityFees?: PriorityFee, commitment?: Commitment): Promise<string>;
    private addTip;
    ping(): Promise<string>;
    sendTransaction(vertionedTx: VersionedTransaction): Promise<string>;
}
//# sourceMappingURL=NodeOneModule.d.ts.map