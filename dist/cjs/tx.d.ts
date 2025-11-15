import { Connection, Transaction, PublicKey, Keypair, Commitment, Finality, VersionedTransaction, VersionedTransactionResponse } from "@solana/web3.js";
import { PriorityFee, TransactionResult } from "./pumpFun.types.js";
export declare function sendTx(connection: Connection, tx: Transaction, payer: PublicKey, signers: Keypair[], priorityFees?: PriorityFee, commitment?: Commitment, finality?: Finality): Promise<TransactionResult>;
export declare const buildVersionedTx: (connection: Connection, payer: PublicKey, tx: Transaction, commitment?: Commitment) => Promise<VersionedTransaction>;
export declare const getTxDetails: (connection: Connection, sig: string, commitment?: Commitment, finality?: Finality) => Promise<VersionedTransactionResponse | null>;
export declare function buildSignedTx(priorityFees: PriorityFee | undefined, tx: Transaction, connection: Connection, payer: PublicKey, commitment: Commitment, signers: Keypair[]): Promise<VersionedTransaction>;
//# sourceMappingURL=tx.d.ts.map