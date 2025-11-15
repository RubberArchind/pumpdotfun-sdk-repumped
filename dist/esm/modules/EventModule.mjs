import { converters } from '../pumpEvents/pumpEvents.consts.mjs';

class EventModule {
    sdk;
    constructor(sdk) {
        this.sdk = sdk;
    }
    addEventListener(eventType, callback) {
        return this.sdk.program.addEventListener(eventType, (event, slot, signature) => {
            try {
                const convert = converters[eventType];
                if (!convert)
                    throw new Error(`No converter for event type: ${eventType}`);
                callback(convert(event), slot, signature);
            }
            catch (err) {
                console.error(`Failed to handle ${eventType}:`, err);
            }
        });
    }
    removeEventListener(id) {
        this.sdk.program.removeEventListener(id);
    }
}

export { EventModule };
//# sourceMappingURL=EventModule.mjs.map
