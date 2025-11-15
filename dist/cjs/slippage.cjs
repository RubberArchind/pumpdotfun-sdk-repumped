'use strict';

const calculateWithSlippageBuy = (amount, basisPoints) => {
    return amount + (amount * basisPoints) / 10000n;
};
function calculateWithSlippageSell(amount, slippageBasisPoints = 500n) {
    // Actually use the slippage basis points for calculation
    const reduction = Math.max(1, Number((amount * slippageBasisPoints) / 10000n));
    return amount - BigInt(reduction);
}

exports.calculateWithSlippageBuy = calculateWithSlippageBuy;
exports.calculateWithSlippageSell = calculateWithSlippageSell;
//# sourceMappingURL=slippage.cjs.map
