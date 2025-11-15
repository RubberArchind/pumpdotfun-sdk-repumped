'use strict';

var pumpEvents = require('./pumpEvents.cjs');

const converters = {
    createEvent: pumpEvents.toCreateEvent,
    tradeEvent: pumpEvents.toTradeEvent,
    completeEvent: pumpEvents.toCompleteEvent,
    setParamsEvent: pumpEvents.toSetParamsEvent,
    collectCreatorFeeEvent: pumpEvents.toCollectCreatorFeeEvent,
    completePumpAmmMigrationEvent: pumpEvents.toCompletePumpAmmMigrationEvent,
    extendAccountEvent: pumpEvents.toExtendAccountEvent,
    setCreatorEvent: pumpEvents.toSetCreatorEvent,
    setMetaplexCreatorEvent: pumpEvents.toSetMetaplexCreatorEvent,
    updateGlobalAuthorityEvent: pumpEvents.toUpdateGlobalAuthorityEvent,
};

exports.converters = converters;
//# sourceMappingURL=pumpEvents.consts.cjs.map
