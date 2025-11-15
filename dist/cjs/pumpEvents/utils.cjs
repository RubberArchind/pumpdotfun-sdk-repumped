'use strict';

var web3_js = require('@solana/web3.js');

const toPubKey = (v) => new web3_js.PublicKey(v);
const toBigInt = (v) => BigInt(v);

exports.toBigInt = toBigInt;
exports.toPubKey = toPubKey;
//# sourceMappingURL=utils.cjs.map
