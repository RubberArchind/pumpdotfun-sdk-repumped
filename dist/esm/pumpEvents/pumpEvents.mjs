import { toPubKey, toBigInt } from './utils.mjs';

function toCollectCreatorFeeEvent(e) {
    return {
        timestamp: Number(e.timestamp),
        creator: toPubKey(e.creator),
        creatorFee: toBigInt(e.creatorFee),
    };
}
function toCompleteEvent(e) {
    return {
        user: toPubKey(e.user),
        mint: toPubKey(e.mint),
        bondingCurve: toPubKey(e.bondingCurve),
        timestamp: Number(e.timestamp),
    };
}
function toCompletePumpAmmMigrationEvent(e) {
    return {
        user: toPubKey(e.user),
        mint: toPubKey(e.mint),
        mintAmount: toBigInt(e.mintAmount),
        solAmount: toBigInt(e.solAmount),
        poolMigrationFee: toBigInt(e.poolMigrationFee),
        bondingCurve: toPubKey(e.bondingCurve),
        timestamp: Number(e.timestamp),
        pool: toPubKey(e.pool),
    };
}
function toCreateEvent(e) {
    return {
        name: e.name,
        symbol: e.symbol,
        uri: e.uri,
        mint: toPubKey(e.mint),
        bondingCurve: toPubKey(e.bondingCurve),
        user: toPubKey(e.user),
        creator: toPubKey(e.creator),
        timestamp: Number(e.timestamp),
        virtualTokenReserves: toBigInt(e.virtualTokenReserves),
        virtualSolReserves: toBigInt(e.virtualSolReserves),
        realTokenReserves: toBigInt(e.realTokenReserves),
        tokenTotalSupply: toBigInt(e.tokenTotalSupply),
    };
}
function toExtendAccountEvent(e) {
    return {
        account: toPubKey(e.account),
        user: toPubKey(e.user),
        currentSize: toBigInt(e.currentSize),
        newSize: toBigInt(e.newSize),
        timestamp: Number(e.timestamp),
    };
}
function toSetCreatorEvent(e) {
    return {
        timestamp: Number(e.timestamp),
        mint: toPubKey(e.mint),
        bondingCurve: toPubKey(e.bondingCurve),
        creator: toPubKey(e.creator),
    };
}
function toSetMetaplexCreatorEvent(e) {
    return {
        timestamp: Number(e.timestamp),
        mint: toPubKey(e.mint),
        bondingCurve: toPubKey(e.bondingCurve),
        metadata: toPubKey(e.metadata),
        creator: toPubKey(e.creator),
    };
}
function toSetParamsEvent(e) {
    return {
        initialVirtualTokenReserves: toBigInt(e.initialVirtualTokenReserves),
        initialVirtualSolReserves: toBigInt(e.initialVirtualSolReserves),
        initialRealTokenReserves: toBigInt(e.initialRealTokenReserves),
        finalRealSolReserves: toBigInt(e.finalRealSolReserves),
        tokenTotalSupply: toBigInt(e.tokenTotalSupply),
        feeBasisPoints: toBigInt(e.feeBasisPoints),
        withdrawAuthority: toPubKey(e.withdrawAuthority),
        enableMigrate: Boolean(e.enableMigrate),
        poolMigrationFee: toBigInt(e.poolMigrationFee),
        creatorFeeBasisPoints: toBigInt(e.creatorFeeBasisPoints),
        feeRecipients: e.feeRecipients.map(toPubKey),
        timestamp: Number(e.timestamp),
        setCreatorAuthority: toPubKey(e.setCreatorAuthority),
    };
}
function toTradeEvent(e) {
    return {
        mint: toPubKey(e.mint),
        solAmount: toBigInt(e.solAmount),
        tokenAmount: toBigInt(e.tokenAmount),
        isBuy: Boolean(e.isBuy),
        user: toPubKey(e.user),
        timestamp: Number(e.timestamp),
        virtualSolReserves: toBigInt(e.virtualSolReserves),
        virtualTokenReserves: toBigInt(e.virtualTokenReserves),
        realSolReserves: toBigInt(e.realSolReserves),
        realTokenReserves: toBigInt(e.realTokenReserves),
        feeRecipient: toPubKey(e.feeRecipient),
        feeBasisPoints: toBigInt(e.feeBasisPoints),
        fee: toBigInt(e.fee),
        creator: toPubKey(e.creator),
        creatorFeeBasisPoints: toBigInt(e.creatorFeeBasisPoints),
        creatorFee: toBigInt(e.creatorFee),
    };
}
function toUpdateGlobalAuthorityEvent(e) {
    return {
        global: toPubKey(e.global),
        authority: toPubKey(e.authority),
        newAuthority: toPubKey(e.newAuthority),
        timestamp: Number(e.timestamp),
    };
}

export { toCollectCreatorFeeEvent, toCompleteEvent, toCompletePumpAmmMigrationEvent, toCreateEvent, toExtendAccountEvent, toSetCreatorEvent, toSetMetaplexCreatorEvent, toSetParamsEvent, toTradeEvent, toUpdateGlobalAuthorityEvent };
//# sourceMappingURL=pumpEvents.mjs.map
