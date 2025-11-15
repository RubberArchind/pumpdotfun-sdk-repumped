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
        // Check buffer size to determine if it's old (243 bytes) or new (244 bytes) format
        const isOldFormat = buffer.length === 243;
        const isNewFormat = buffer.length === 244;
        if (!isOldFormat && !isNewFormat) {
            throw new Error(`Invalid GlobalAccount buffer size: ${buffer.length} (expected 243 or 244)`);
        }
        // Use appropriate structure based on buffer size
        const structure = isOldFormat
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
                borsh.publicKey("reservedFeeRecipient"),
                borsh.bool("mayhemModeEnabled"),
            ]);
        let value = structure.decode(buffer);
        return new GlobalAccount(BigInt(value.discriminator), value.initialized, value.authority, value.feeRecipient, BigInt(value.initialVirtualTokenReserves), BigInt(value.initialVirtualSolReserves), BigInt(value.initialRealTokenReserves), BigInt(value.tokenTotalSupply), BigInt(value.feeBasisPoints), value.withdrawAuthority, value.enableMigrate, BigInt(value.poolMigrationFee), BigInt(value.creatorFeeBasisPoints), isOldFormat ? web3_js.PublicKey.default : value.reservedFeeRecipient, isOldFormat ? false : value.mayhemModeEnabled);
    }
}

exports.GlobalAccount = GlobalAccount;
//# sourceMappingURL=GlobalAccount.cjs.map
