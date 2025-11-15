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
    // The Global account structure has changed significantly and is now 740 bytes
    // The new structure has additional fields that we don't fully understand yet
    // We'll parse only the core fields we need for trading operations
    
    const minRequiredSize = 162; // Up to creatorFeeBasisPoints
    
    if (buffer.length < minRequiredSize) {
      throw new Error(`Invalid GlobalAccount buffer size: ${buffer.length} (expected at least ${minRequiredSize})`);
    }

    // Parse only the core fields that haven't changed structure
    const structure: Layout<Partial<GlobalAccount>> = struct([
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

    // Decode only the first 162 bytes (up to creatorFeeBasisPoints)
    let value = structure.decode(buffer.subarray(0, minRequiredSize));
    
    return new GlobalAccount(
      BigInt(value.discriminator!),
      value.initialized!,
      value.authority!,
      value.feeRecipient!,
      BigInt(value.initialVirtualTokenReserves!),
      BigInt(value.initialVirtualSolReserves!),
      BigInt(value.initialRealTokenReserves!),
      BigInt(value.tokenTotalSupply!),
      BigInt(value.feeBasisPoints!),
      value.withdrawAuthority!,
      value.enableMigrate!,
      BigInt(value.poolMigrationFee!),
      BigInt(value.creatorFeeBasisPoints!),
      PublicKey.default, // reservedFeeRecipient - structure changed, use default
      false // mayhemModeEnabled - structure changed, use default
    );
  }
}
