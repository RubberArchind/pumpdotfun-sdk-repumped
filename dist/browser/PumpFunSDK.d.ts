import { Program, Idl, Provider } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import { EventModule } from "./modules/EventModule.js";
import { TokenModule } from "./modules/TokenModule.js";
import { TradeModule } from "./modules/TradeModule.js";
import { PdaModule } from "./modules/PdaModule.js";
import { JitoModule } from "./modules/JitoModule.js";
import { PumpOptions } from "./pumpFun.types.js";
import { AstraModule } from "./modules/AstraModule.js";
import { SlotModule } from "./modules/SlotModule.js";
import { NextBlockModule } from "./modules/NextBlockModule.js";
import { NodeOneModule } from "./modules/NodeOneModule.js";
export declare class PumpFunSDK {
    program: Program<Idl>;
    connection: Connection;
    token: TokenModule;
    trade: TradeModule;
    pda: PdaModule;
    jito?: JitoModule;
    astra?: AstraModule;
    slot?: SlotModule;
    nextBlock?: NextBlockModule;
    nodeOne?: NodeOneModule;
    events: EventModule;
    constructor(provider: Provider, options?: PumpOptions);
}
//# sourceMappingURL=PumpFunSDK.d.ts.map