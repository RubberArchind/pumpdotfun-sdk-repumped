# Sell Token Script

Simple script to sell pump.fun tokens using a mint address and private key.

## Usage

```bash
npm run sell <MINT_ADDRESS> <PRIVATE_KEY> [AMOUNT_PERCENT]
```

### Parameters

- **MINT_ADDRESS**: The token mint address (required)
- **PRIVATE_KEY**: Base58-encoded private key of the wallet holding the tokens (required)
- **AMOUNT_PERCENT**: Percentage of tokens to sell, 1-100 (optional, default: 100)

### Examples

**Sell 100% of tokens:**
```bash
npm run sell 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU your_base58_private_key
```

**Sell 50% of tokens:**
```bash
npm run sell 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU your_base58_private_key 50
```

**Sell 25% of tokens:**
```bash
npm run sell 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU your_base58_private_key 25
```

## Configuration

The script uses the following settings:
- **RPC**: Uses `HELIUS_RPC_URL` from .env or defaults to public Solana mainnet RPC
- **Slippage**: 5% (500 basis points)
- **Priority Fee**: 250,000 lamports

To use a custom RPC, set `HELIUS_RPC_URL` in your `.env` file:
```
HELIUS_RPC_URL=https://your-rpc-endpoint.com
```

## Requirements

- Node.js >= 18
- Sufficient SOL balance (minimum 0.005 SOL for transaction fees)
- Token balance in the wallet

## Output

The script displays:
- Wallet and mint information
- Current SOL and token balances
- Bonding curve status
- Expected SOL output
- Transaction signature and explorer link
- Final balances after sell

## Error Handling

The script will exit with an error if:
- Invalid mint address or private key format
- Insufficient SOL for transaction fees
- No tokens to sell
- Token has graduated to Raydium
- Transaction simulation fails

## Notes

- This script only works for tokens still on pump.fun bonding curve
- Tokens that have graduated to Raydium must be sold through Raydium
- The script uses legacy token program ATAs as required by pump.fun's sell instruction

## Token2022 Support

**Status**: ✅ Token2022 tokens are now fully supported as of SDK v2.0!

**What changed**: On November 11, 2025, pump.fun updated the on-chain program to support Token2022 tokens. This SDK has been updated to match those breaking changes:
- IDL now accepts both `TOKEN_PROGRAM_ID` (legacy) and `TOKEN_2022_PROGRAM_ID` 
- The `sell()` method automatically detects the token type and uses the correct program
- No additional configuration needed

**Token2022 Trading**: You can now sell Token2022 tokens directly using the same `sell()` method:
```bash
bun run example/sellToken.ts 4JN5guh15dfPxoBe6KgsipAnKJC3zLgj6VJ1us4Dpump your_base58_private_key
```

The script will automatically:
- Detect if the mint is Token2022
- Find the correct Token2022 ATA for your wallet
- Use the Token2022 program when executing the sell transaction

No manual workarounds or transfers needed!
