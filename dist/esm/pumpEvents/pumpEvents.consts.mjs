import { toUpdateGlobalAuthorityEvent, toSetMetaplexCreatorEvent, toSetCreatorEvent, toExtendAccountEvent, toCompletePumpAmmMigrationEvent, toCollectCreatorFeeEvent, toSetParamsEvent, toCompleteEvent, toTradeEvent, toCreateEvent } from './pumpEvents.mjs';

const converters = {
    createEvent: toCreateEvent,
    tradeEvent: toTradeEvent,
    completeEvent: toCompleteEvent,
    setParamsEvent: toSetParamsEvent,
    collectCreatorFeeEvent: toCollectCreatorFeeEvent,
    completePumpAmmMigrationEvent: toCompletePumpAmmMigrationEvent,
    extendAccountEvent: toExtendAccountEvent,
    setCreatorEvent: toSetCreatorEvent,
    setMetaplexCreatorEvent: toSetMetaplexCreatorEvent,
    updateGlobalAuthorityEvent: toUpdateGlobalAuthorityEvent,
};

export { converters };
//# sourceMappingURL=pumpEvents.consts.mjs.map
