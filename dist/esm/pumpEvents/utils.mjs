import { PublicKey } from '@solana/web3.js';

const toPubKey = (v) => new PublicKey(v);
const toBigInt = (v) => BigInt(v);

export { toBigInt, toPubKey };
//# sourceMappingURL=utils.mjs.map
