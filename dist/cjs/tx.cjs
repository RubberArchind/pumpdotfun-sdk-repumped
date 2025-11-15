'use strict';

var web3_js = require('@solana/web3.js');
var pumpFun_consts = require('./pumpFun.consts.cjs');

async function sendTx(connection, tx, payer, signers, priorityFees, commitment = pumpFun_consts.DEFAULT_COMMITMENT, finality = pumpFun_consts.DEFAULT_FINALITY) {
    let versionedTx = await buildSignedTx(priorityFees, tx, connection, payer, commitment, signers);
    try {
        const sig = await connection.sendTransaction(versionedTx, {
            skipPreflight: false,
        });
        console.log("sig:", `https://solscan.io/tx/${sig}`);
        let txResult = await getTxDetails(connection, sig, commitment, finality);
        if (!txResult) {
            return {
                success: false,
                error: "Transaction failed",
            };
        }
        return {
            success: true,
            signature: sig,
            results: txResult,
        };
    }
    catch (e) {
        if (e instanceof web3_js.SendTransactionError) {
            let ste = e;
            console.log("SendTransactionError" + ste.logs);
        }
        else {
            console.error(e);
        }
        return {
            error: e,
            success: false,
        };
    }
}
const buildVersionedTx = async (connection, payer, tx, commitment = pumpFun_consts.DEFAULT_COMMITMENT) => {
    const blockHash = (await connection.getLatestBlockhash(commitment)).blockhash;
    let messageV0 = new web3_js.TransactionMessage({
        payerKey: payer,
        recentBlockhash: blockHash,
        instructions: tx.instructions,
    }).compileToV0Message();
    return new web3_js.VersionedTransaction(messageV0);
};
const getTxDetails = async (connection, sig, commitment = pumpFun_consts.DEFAULT_COMMITMENT, finality = pumpFun_consts.DEFAULT_FINALITY) => {
    const latestBlockHash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: sig,
    }, commitment);
    return connection.getTransaction(sig, {
        maxSupportedTransactionVersion: 0,
        commitment: finality,
    });
};
async function buildSignedTx(priorityFees, tx, connection, payer, commitment, signers) {
    let newTx = new web3_js.Transaction();
    if (priorityFees) {
        const modifyComputeUnits = web3_js.ComputeBudgetProgram.setComputeUnitLimit({
            units: priorityFees.unitLimit,
        });
        const addPriorityFee = web3_js.ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: priorityFees.unitPrice,
        });
        newTx.add(modifyComputeUnits);
        newTx.add(addPriorityFee);
    }
    newTx.add(tx);
    let versionedTx = await buildVersionedTx(connection, payer, newTx, commitment);
    versionedTx.sign(signers);
    return versionedTx;
}

exports.buildSignedTx = buildSignedTx;
exports.buildVersionedTx = buildVersionedTx;
exports.getTxDetails = getTxDetails;
exports.sendTx = sendTx;
//# sourceMappingURL=tx.cjs.map
