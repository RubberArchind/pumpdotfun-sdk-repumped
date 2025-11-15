# Migration Guide - Pump.fun Breaking Changes (Nov 11, 2025)

This SDK has been updated to support the breaking changes announced by pump.fun for November 11, 2025. This guide explains what changed and how to use the new features.

## What Changed

### 1. New Token Creation Method: `createV2`

pump.fun introduced a new token creation instruction that uses **Token2022** instead of the legacy Metaplex metadata system.

**Key Differences:**
- Uses Token2022 program (`TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`)
- Supports optional "Mayhem Mode" 
- Requires 15 accounts instead of 13
- Metadata stored in Token2022 extensions, not Metaplex

### 2. Mayhem Mode

Tokens can now be created in "Mayhem Mode" which uses a different fee recipient:

- **Standard Mode** (`isMayhemMode = false`): Uses normal fee recipient
- **Mayhem Mode** (`isMayhemMode = true`): Uses mayhem fee recipient (`GesfTA3X2arioaHp8bbKdjG9vJtskViWACZoYvxp4twS`)

### 3. Account Structure Changes

**BondingCurveAccount:**
- Added `isMayhemMode: boolean` field
- Account size increased from 81 to 82 bytes

**GlobalAccount:**
- Added `reservedFeeRecipient: PublicKey` field
- Added `mayhemModeEnabled: boolean` field

## How to Use

### Creating Tokens with Token2022 (Recommended)

```typescript
import { Keypair } from "@solana/web3.js";
import { PumpFunSDK } from "pumpdotfun-sdk";

const sdk = new PumpFunSDK();
const creator = Keypair.generate();
const mint = Keypair.generate();

// Create token with mayhem mode disabled (default)
const result = await sdk.trade.createAndBuyV2(
  creator,
  mint,
  {
    name: "My Token",
    symbol: "MTK",
    description: "A cool token",
    file: imageBuffer, // Your token image
  },
  1000000000n, // 1 SOL initial buy
  false // isMayhemMode = false
);

// Create token WITH mayhem mode
const mayhemResult = await sdk.trade.createAndBuyV2(
  creator,
  mint,
  metadata,
  1000000000n,
  true // isMayhemMode = true
);
```

### Creating Tokens the Old Way (Still Supported)

The legacy `create` method using Metaplex metadata still works:

```typescript
const legacyResult = await sdk.trade.createAndBuy(
  creator,
  mint,
  metadata,
  1000000000n
);
```

**Note:** Legacy tokens always have `isMayhemMode = false` and cannot be changed.

### Getting Create Instructions Only

```typescript
// Token2022 version
const createV2Tx = await sdk.trade.getCreateV2Instructions(
  creator.publicKey,
  "Token Name",
  "SYMBOL",
  "https://metadata-uri.com",
  mint,
  false // isMayhemMode
);

// Legacy version
const createTx = await sdk.trade.getCreateInstructions(
  creator.publicKey,
  "Token Name",
  "SYMBOL",
  "https://metadata-uri.com",
  mint
);
```

### Checking Mayhem Mode Status

```typescript
const bondingCurve = await sdk.token.getBondingCurveAccount(mint);
if (bondingCurve.isMayhemMode) {
  console.log("This token uses mayhem mode fee recipient");
}
```

## New Constants Available

```typescript
import {
  MAYHEM_PROGRAM_ID,        // MAyhSmzXzV1pTf7LsNkrNwkWKTo4ougAJ1PPg47MD4e
  MAYHEM_FEE_RECIPIENT,     // GesfTA3X2arioaHp8bbKdjG9vJtskViWACZoYvxp4twS
  TOKEN_2022_PROGRAM_ID,    // TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  LEGACY_TOKEN_PROGRAM_ID,  // TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
} from "pumpdotfun-sdk";
```

## New PDA Helper Methods

```typescript
// Mayhem-related PDAs
const mayhemState = sdk.pda.getMayhemStatePda(mint);
const globalParams = sdk.pda.getGlobalParamsPda();
const solVault = sdk.pda.getSolVaultPda();
const mayhemTokenVault = sdk.pda.getMayhemTokenVaultPda(mint);
```

## Backward Compatibility

✅ **Existing code continues to work without changes**

- `createAndBuy()` method still works with legacy Metaplex tokens
- Existing buy/sell methods work with both legacy and Token2022 tokens
- All existing tokens have `isMayhemMode = false`
- Fee recipient logic automatically handles both modes

## Migration Recommendations

1. **For New Tokens**: Use `createAndBuyV2()` with Token2022
2. **For Existing Integrations**: No changes required - everything remains backward compatible
3. **For Mayhem Mode**: Set `isMayhemMode = true` only if you specifically need the mayhem fee recipient

## Breaking Changes Summary

| Change | Impact | Action Required |
|--------|--------|-----------------|
| New `createV2` instruction | None (optional) | Use `createAndBuyV2()` for new tokens |
| BondingCurve account size +1 byte | None (auto-handled) | No action needed |
| Global account new fields | None | No action needed |
| Mayhem mode support | None (opt-in) | Set `isMayhemMode = true` if needed |

## Support

For questions or issues, please refer to:
- [Official pump.fun docs](https://github.com/pump-fun/pump-public-docs)
- [Original SDK repository](https://github.com/yourusername/pumpdotfun-sdk-repumped)

---

**Updated:** November 15, 2025  
**SDK Version:** 1.5.0+  
**Breaking Changes Effective:** November 11, 2025 12:00 UTC
