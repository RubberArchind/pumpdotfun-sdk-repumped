import { PumpFunEventType, PumpFunEventHandlers } from "../pumpEvents/pumpEvents.types.js";
import { PumpFunSDK } from "../PumpFunSDK.js";
export declare class EventModule {
    private sdk;
    constructor(sdk: PumpFunSDK);
    addEventListener<T extends PumpFunEventType>(eventType: T, callback: (event: PumpFunEventHandlers[T], slot: number, signature: string) => void): number;
    removeEventListener(id: number): void;
}
//# sourceMappingURL=EventModule.d.ts.map