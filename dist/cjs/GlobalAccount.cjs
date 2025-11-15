'use strict';

var web3_js = require('@solana/web3.js');
var borsh = require('@coral-xyz/borsh');

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
        this.reservedFeeRecipient = reservedFeeRecipient || web3_js.PublicKey.default;
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
            ? borsh.struct([
                borsh.u64("discriminator"),
                borsh.bool("initialized"),
                borsh.publicKey("authority"),
                borsh.publicKey("feeRecipient"),
                borsh.u64("initialVirtualTokenReserves"),
                borsh.u64("initialVirtualSolReserves"),
                borsh.u64("initialRealTokenReserves"),
                borsh.u64("tokenTotalSupply"),
                borsh.u64("feeBasisPoints"),
                borsh.publicKey("withdrawAuthority"),
                borsh.bool("enableMigrate"),
                borsh.u64("poolMigrationFee"),
                borsh.u64("creatorFeeBasisPoints"),
                borsh.publicKey("reservedFeeRecipient"),
                borsh.bool("mayhemModeEnabled"),
            ])
            : borsh.struct([
                borsh.u64("discriminator"),
                borsh.bool("initialized"),
                borsh.publicKey("authority"),
                borsh.publicKey("feeRecipient"),
                borsh.u64("initialVirtualTokenReserves"),
                borsh.u64("initialVirtualSolReserves"),
                borsh.u64("initialRealTokenReserves"),
                borsh.u64("tokenTotalSupply"),
                borsh.u64("feeBasisPoints"),
                borsh.publicKey("withdrawAuthority"),
                borsh.bool("enableMigrate"),
                borsh.u64("poolMigrationFee"),
                borsh.u64("creatorFeeBasisPoints"),
            ]);
        // Only decode the bytes we need (first 243 or 244 bytes)
        const bytesToDecode = hasNewFields ? minNewSize : minOldSize;
        let value = structure.decode(buffer.subarray(0, bytesToDecode));
        return new GlobalAccount(BigInt(value.discriminator), value.initialized, value.authority, value.feeRecipient, BigInt(value.initialVirtualTokenReserves), BigInt(value.initialVirtualSolReserves), BigInt(value.initialRealTokenReserves), BigInt(value.tokenTotalSupply), BigInt(value.feeBasisPoints), value.withdrawAuthority, value.enableMigrate, BigInt(value.poolMigrationFee), BigInt(value.creatorFeeBasisPoints), hasNewFields ? value.reservedFeeRecipient : web3_js.PublicKey.default, hasNewFields ? value.mayhemModeEnabled : false);
    }
}

exports.GlobalAccount = GlobalAccount;
//# sourceMappingURL=GlobalAccount.cjs.map
