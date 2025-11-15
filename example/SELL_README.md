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
