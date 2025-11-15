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
        // The Global account has been expanded significantly beyond the original 243/244 bytes
        // We only need to read the first 243 or 244 bytes for the fields we care about
        const minOldSize = 243;
        const minNewSize = 244;
        if (buffer.length < minOldSize) {
            throw new Error(`Invalid GlobalAccount buffer size: ${buffer.length} (expected at least ${minOldSize})`);
        }
        // Check if we have the new fields by looking at byte 243
        const hasNewFields = buffer.length >= minNewSize;
        // Use appropriate structure based on available data
        const structure = hasNewFields
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
                publicKey("reservedFeeRecipient"),
                bool("mayhemModeEnabled"),
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
            ]);
        // Only decode the bytes we need (first 243 or 244 bytes)
        const bytesToDecode = hasNewFields ? minNewSize : minOldSize;
        let value = structure.decode(buffer.subarray(0, bytesToDecode));
        return new GlobalAccount(BigInt(value.discriminator), value.initialized, value.authority, value.feeRecipient, BigInt(value.initialVirtualTokenReserves), BigInt(value.initialVirtualSolReserves), BigInt(value.initialRealTokenReserves), BigInt(value.tokenTotalSupply), BigInt(value.feeBasisPoints), value.withdrawAuthority, value.enableMigrate, BigInt(value.poolMigrationFee), BigInt(value.creatorFeeBasisPoints), hasNewFields ? value.reservedFeeRecipient : PublicKey.default, hasNewFields ? value.mayhemModeEnabled : false);
    }
}

export { GlobalAccount };
//# sourceMappingURL=GlobalAccount.mjs.map
