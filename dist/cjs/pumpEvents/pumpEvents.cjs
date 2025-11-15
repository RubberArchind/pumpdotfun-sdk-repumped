'use strict';

var utils = require('./utils.cjs');

function toCollectCreatorFeeEvent(e) {
    return {
        timestamp: Number(e.timestamp),
        creator: utils.toPubKey(e.creator),
        creatorFee: utils.toBigInt(e.creatorFee),
    };
}
function toCompleteEvent(e) {
    return {
        user: utils.toPubKey(e.user),
        mint: utils.toPubKey(e.mint),
        bondingCurve: utils.toPubKey(e.bondingCurve),
        timestamp: Number(e.timestamp),
    };
}
function toCompletePumpAmmMigrationEvent(e) {
    return {
        user: utils.toPubKey(e.user),
        mint: utils.toPubKey(e.mint),
        mintAmount: utils.toBigInt(e.mintAmount),
        solAmount: utils.toBigInt(e.solAmount),
        poolMigrationFee: utils.toBigInt(e.poolMigrationFee),
        bondingCurve: utils.toPubKey(e.bondingCurve),
        timestamp: Number(e.timestamp),
        pool: utils.toPubKey(e.pool),
    };
}
function toCreateEvent(e) {
    return {
        name: e.name,
        symbol: e.symbol,
        uri: e.uri,
        mint: utils.toPubKey(e.mint),
        bondingCurve: utils.toPubKey(e.bondingCurve),
        user: utils.toPubKey(e.user),
        creator: utils.toPubKey(e.creator),
        timestamp: Number(e.timestamp),
        virtualTokenReserves: utils.toBigInt(e.virtualTokenReserves),
        virtualSolReserves: utils.toBigInt(e.virtualSolReserves),
        realTokenReserves: utils.toBigInt(e.realTokenReserves),
        tokenTotalSupply: utils.toBigInt(e.tokenTotalSupply),
    };
}
function toExtendAccountEvent(e) {
    return {
        account: utils.toPubKey(e.account),
        user: utils.toPubKey(e.user),
        currentSize: utils.toBigInt(e.currentSize),
        newSize: utils.toBigInt(e.newSize),
        timestamp: Number(e.timestamp),
    };
}
function toSetCreatorEvent(e) {
    return {
        timestamp: Number(e.timestamp),
        mint: utils.toPubKey(e.mint),
        bondingCurve: utils.toPubKey(e.bondingCurve),
        creator: utils.toPubKey(e.creator),
    };
}
function toSetMetaplexCreatorEvent(e) {
    return {
        timestamp: Number(e.timestamp),
        mint: utils.toPubKey(e.mint),
        bondingCurve: utils.toPubKey(e.bondingCurve),
        metadata: utils.toPubKey(e.metadata),
        creator: utils.toPubKey(e.creator),
    };
}
function toSetParamsEvent(e) {
    return {
        initialVirtualTokenReserves: utils.toBigInt(e.initialVirtualTokenReserves),
        initialVirtualSolReserves: utils.toBigInt(e.initialVirtualSolReserves),
        initialRealTokenReserves: utils.toBigInt(e.initialRealTokenReserves),
        finalRealSolReserves: utils.toBigInt(e.finalRealSolReserves),
        tokenTotalSupply: utils.toBigInt(e.tokenTotalSupply),
        feeBasisPoints: utils.toBigInt(e.feeBasisPoints),
        withdrawAuthority: utils.toPubKey(e.withdrawAuthority),
        enableMigrate: Boolean(e.enableMigrate),
        poolMigrationFee: utils.toBigInt(e.poolMigrationFee),
        creatorFeeBasisPoints: utils.toBigInt(e.creatorFeeBasisPoints),
        feeRecipients: e.feeRecipients.map(utils.toPubKey),
        timestamp: Number(e.timestamp),
        setCreatorAuthority: utils.toPubKey(e.setCreatorAuthority),
    };
}
function toTradeEvent(e) {
    return {
        mint: utils.toPubKey(e.mint),
        solAmount: utils.toBigInt(e.solAmount),
        tokenAmount: utils.toBigInt(e.tokenAmount),
        isBuy: Boolean(e.isBuy),
        user: utils.toPubKey(e.user),
        timestamp: Number(e.timestamp),
        virtualSolReserves: utils.toBigInt(e.virtualSolReserves),
        virtualTokenReserves: utils.toBigInt(e.virtualTokenReserves),
        realSolReserves: utils.toBigInt(e.realSolReserves),
        realTokenReserves: utils.toBigInt(e.realTokenReserves),
        feeRecipient: utils.toPubKey(e.feeRecipient),
        feeBasisPoints: utils.toBigInt(e.feeBasisPoints),
        fee: utils.toBigInt(e.fee),
        creator: utils.toPubKey(e.creator),
        creatorFeeBasisPoints: utils.toBigInt(e.creatorFeeBasisPoints),
        creatorFee: utils.toBigInt(e.creatorFee),
    };
}
function toUpdateGlobalAuthorityEvent(e) {
    return {
        global: utils.toPubKey(e.global),
        authority: utils.toPubKey(e.authority),
        newAuthority: utils.toPubKey(e.newAuthority),
        timestamp: Number(e.timestamp),
    };
}

exports.toCollectCreatorFeeEvent = toCollectCreatorFeeEvent;
exports.toCompleteEvent = toCompleteEvent;
exports.toCompletePumpAmmMigrationEvent = toCompletePumpAmmMigrationEvent;
exports.toCreateEvent = toCreateEvent;
exports.toExtendAccountEvent = toExtendAccountEvent;
exports.toSetCreatorEvent = toSetCreatorEvent;
exports.toSetMetaplexCreatorEvent = toSetMetaplexCreatorEvent;
exports.toSetParamsEvent = toSetParamsEvent;
exports.toTradeEvent = toTradeEvent;
exports.toUpdateGlobalAuthorityEvent = toUpdateGlobalAuthorityEvent;
//# sourceMappingURL=pumpEvents.cjs.map
