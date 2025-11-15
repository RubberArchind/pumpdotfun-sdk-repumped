import { PublicKey } from '@solana/web3.js';
import { struct, u64, bool, publicKey } from '@coral-xyz/borsh';

class GlobalAccount {
    discriminator;
    initialized = false;
    authority;
    feeRecipient;
    initialVirtualTokenReserves;
    initialVirtualSolReserves;
    initialRealTokenReserves;
    tokenTotalSupply;
    feeBasisPoints;
    withdrawAuthority;
    enableMigrate = false;
    poolMigrationFee;
    creatorFeeBasisPoints;
    reservedFeeRecipient;
    mayhemModeEnabled = false;
    constructor(discriminator, initialized, authority, feeRecipient, initialVirtualTokenReserves, initialVirtualSolReserves, initialRealTokenReserves, tokenTotalSupply, feeBasisPoints, withdrawAuthority, enableMigrate, poolMigrationFee, creatorFeeBasisPoints, reservedFeeRecipient, mayhemModeEnabled = false) {
        this.discriminator = discriminator;
        this.initialized = initialized;
        this.authority = authority;
        this.feeRecipient = feeRecipient;
        this.initialVirtualTokenReserves = initialVirtualTokenReserves;
        this.initialVirtualSolReserves = initialVirtualSolReserves;
        this.initialRealTokenReserves = initialRealTokenReserves;
        this.tokenTotalSupply = tokenTotalSupply;
        this.feeBasisPoints = feeBasisPoints;
        this.withdrawAuthority = withdrawAuthority;
        this.enableMigrate = enableMigrate;
        this.poolMigrationFee = poolMigrationFee;
        this.creatorFeeBasisPoints = creatorFeeBasisPoints;
        this.reservedFeeRecipient = reservedFeeRecipient || PublicKey.default;
        this.mayhemModeEnabled = mayhemModeEnabled;
    }
    getInitialBuyPrice(amount) {
        if (amount <= 0n) {
            return 0n;
        }
        let n = this.initialVirtualSolReserves * this.initialVirtualTokenReserves;
        let i = this.initialVirtualSolReserves + amount;
        let r = n / i + 1n;
        let s = this.initialVirtualTokenReserves - r;
        return s < this.initialRealTokenReserves
            ? s
            : this.initialRealTokenReserves;
    }
    static fromBuffer(buffer) {
        // Check buffer size to determine if it's old (243 bytes) or new (244 bytes) format
        const isOldFormat = buffer.length === 243;
        const isNewFormat = buffer.length === 244;
        if (!isOldFormat && !isNewFormat) {
            throw new Error(`Invalid GlobalAccount buffer size: ${buffer.length} (expected 243 or 244)`);
        }
        // Use appropriate structure based on buffer size
        const structure = isOldFormat
            ? struct([
                u64("discriminator"),
                bool("initialized"),
                publicKey("authority"),
                publicKey("feeRecipient"),
                u64("initialVirtualTokenReserves"),
                u64("initialVirtualSolReserves"),
                u64("initialRealTokenReserves"),
                u64("tokenTotalSupply"),
                u64("feeBasisPoints"),
                publicKey("withdrawAuthority"),
                bool("enableMigrate"),
                u64("poolMigrationFee"),
                u64("creatorFeeBasisPoints"),
            ])
            : struct([
                u64("discriminator"),
                bool("initialized"),
                publicKey("authority"),
                publicKey("feeRecipient"),
                u64("initialVirtualTokenReserves"),
                u64("initialVirtualSolReserves"),
                u64("initialRealTokenReserves"),
                u64("tokenTotalSupply"),
                u64("feeBasisPoints"),
                publicKey("withdrawAuthority"),
                bool("enableMigrate"),
                u64("poolMigrationFee"),
                u64("creatorFeeBasisPoints"),
                publicKey("reservedFeeRecipient"),
                bool("mayhemModeEnabled"),
            ]);
        let value = structure.decode(buffer);
        return new GlobalAccount(BigInt(value.discriminator), value.initialized, value.authority, value.feeRecipient, BigInt(value.initialVirtualTokenReserves), BigInt(value.initialVirtualSolReserves), BigInt(value.initialRealTokenReserves), BigInt(value.tokenTotalSupply), BigInt(value.feeBasisPoints), value.withdrawAuthority, value.enableMigrate, BigInt(value.poolMigrationFee), BigInt(value.creatorFeeBasisPoints), isOldFormat ? PublicKey.default : value.reservedFeeRecipient, isOldFormat ? false : value.mayhemModeEnabled);
    }
}

export { GlobalAccount };
//# sourceMappingURL=GlobalAccount.mjs.map
