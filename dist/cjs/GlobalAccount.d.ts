import { PublicKey } from "@solana/web3.js";
export declare class GlobalAccount {
    discriminator: bigint;
    initialized: boolean;
    authority: PublicKey;
    feeRecipient: PublicKey;
    initialVirtualTokenReserves: bigint;
    initialVirtualSolReserves: bigint;
    initialRealTokenReserves: bigint;
    tokenTotalSupply: bigint;
    feeBasisPoints: bigint;
    withdrawAuthority: PublicKey;
    enableMigrate: boolean;
    poolMigrationFee: bigint;
    creatorFeeBasisPoints: bigint;
    reservedFeeRecipient: PublicKey;
    mayhemModeEnabled: boolean;
    constructor(discriminator: bigint, initialized: boolean, authority: PublicKey, feeRecipient: PublicKey, initialVirtualTokenReserves: bigint, initialVirtualSolReserves: bigint, initialRealTokenReserves: bigint, tokenTotalSupply: bigint, feeBasisPoints: bigint, withdrawAuthority: PublicKey, enableMigrate: boolean, poolMigrationFee: bigint, creatorFeeBasisPoints: bigint, reservedFeeRecipient?: PublicKey, mayhemModeEnabled?: boolean);
    getInitialBuyPrice(amount: bigint): bigint;
    static fromBuffer(buffer: Buffer): GlobalAccount;
}
//# sourceMappingURL=GlobalAccount.d.ts.map