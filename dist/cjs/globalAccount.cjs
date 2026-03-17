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
        // The Global account structure has changed significantly and is now 740 bytes.
        // We parse the stable trading fields, including the reserved fee recipient and
        // mayhem mode flag introduced in the Nov 2025 upgrade.
        const minRequiredSize = 195;
        if (buffer.length < minRequiredSize) {
            throw new Error(`Invalid GlobalAccount buffer size: ${buffer.length} (expected at least ${minRequiredSize})`);
        }
        // Parse only the stable fields needed for trading operations.
        const structure = borsh.struct([
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
            borsh.u8("mayhemModeEnabled"),
        ]);
        // Decode only the fields we actively use.
        let value = structure.decode(buffer.subarray(0, minRequiredSize));
        return new GlobalAccount(BigInt(value.discriminator), value.initialized, value.authority, value.feeRecipient, BigInt(value.initialVirtualTokenReserves), BigInt(value.initialVirtualSolReserves), BigInt(value.initialRealTokenReserves), BigInt(value.tokenTotalSupply), BigInt(value.feeBasisPoints), value.withdrawAuthority, value.enableMigrate, BigInt(value.poolMigrationFee), BigInt(value.creatorFeeBasisPoints), value.reservedFeeRecipient, Boolean(value.mayhemModeEnabled));
    }
}

exports.GlobalAccount = GlobalAccount;
//# sourceMappingURL=globalAccount.cjs.map
