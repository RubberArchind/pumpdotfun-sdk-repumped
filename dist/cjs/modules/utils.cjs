'use strict';

var web3_js = require('@solana/web3.js');

const ACCOUNTS = [
    new web3_js.PublicKey("96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5"),
    new web3_js.PublicKey("DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh"),
    new web3_js.PublicKey("DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL"),
    new web3_js.PublicKey("ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49"),
    new web3_js.PublicKey("Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY"),
    new web3_js.PublicKey("ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt"),
    new web3_js.PublicKey("HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe"),
    new web3_js.PublicKey("3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT"),
];
function getRandomJitoTipAccount() {
    const randomIndex = Math.floor(Math.random() * ACCOUNTS.length);
    return ACCOUNTS[randomIndex];
}

exports.getRandomJitoTipAccount = getRandomJitoTipAccount;
//# sourceMappingURL=utils.cjs.map
