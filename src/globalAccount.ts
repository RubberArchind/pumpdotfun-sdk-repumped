import { PublicKey } from "@solana/web3.js";
import { struct, bool, u64, publicKey, Layout } from "@coral-xyz/borsh";

export class GlobalAccount {
  public discriminator: bigint;
  public initialized: boolean = false;
  public authority: PublicKey;
  public feeRecipient: PublicKey;
  public initialVirtualTokenReserves: bigint;
  public initialVirtualSolReserves: bigint;
  public initialRealTokenReserves: bigint;
  public tokenTotalSupply: bigint;
  public feeBasisPoints: bigint;
  public withdrawAuthority: PublicKey;
  public enableMigrate: boolean = false;
  public poolMigrationFee: bigint;
  public creatorFeeBasisPoints: bigint;
  public reservedFeeRecipient: PublicKey;
  public mayhemModeEnabled: boolean = false;

  constructor(
    discriminator: bigint,
    initialized: boolean,
    authority: PublicKey,
    feeRecipient: PublicKey,
    initialVirtualTokenReserves: bigint,
    initialVirtualSolReserves: bigint,
    initialRealTokenReserves: bigint,
    tokenTotalSupply: bigint,
    feeBasisPoints: bigint,
    withdrawAuthority: PublicKey,
    enableMigrate: boolean,
    poolMigrationFee: bigint,
    creatorFeeBasisPoints: bigint,
    reservedFeeRecipient?: PublicKey,
    mayhemModeEnabled: boolean = false
  ) {
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

  getInitialBuyPrice(amount: bigint): bigint {
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

  public static fromBuffer(buffer: Buffer): GlobalAccount {
    // Check buffer size to determine if it's old (243 bytes) or new (244 bytes) format
    const isOldFormat = buffer.length === 243;
    const isNewFormat = buffer.length === 244;

    if (!isOldFormat && !isNewFormat) {
      throw new Error(`Invalid GlobalAccount buffer size: ${buffer.length} (expected 243 or 244)`);
    }

    // Use appropriate structure based on buffer size
    const structure: Layout<GlobalAccount> = isOldFormat
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
    return new GlobalAccount(
      BigInt(value.discriminator),
      value.initialized,
      value.authority,
      value.feeRecipient,
      BigInt(value.initialVirtualTokenReserves),
      BigInt(value.initialVirtualSolReserves),
      BigInt(value.initialRealTokenReserves),
      BigInt(value.tokenTotalSupply),
      BigInt(value.feeBasisPoints),
      value.withdrawAuthority,
      value.enableMigrate,
      BigInt(value.poolMigrationFee),
      BigInt(value.creatorFeeBasisPoints),
      isOldFormat ? PublicKey.default : (value as any).reservedFeeRecipient,
      isOldFormat ? false : (value as any).mayhemModeEnabled
    );
  }
}
