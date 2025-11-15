import { Program } from '@coral-xyz/anchor';
import IDL from './IDL/pump-fun.json.mjs';
import { EventModule } from './modules/EventModule.mjs';
import { TokenModule } from './modules/TokenModule.mjs';
import { TradeModule } from './modules/TradeModule.mjs';
import { PdaModule } from './modules/PdaModule.mjs';
import { JitoModule } from './modules/JitoModule.mjs';
import { AstraModule } from './modules/AstraModule.mjs';
import { SlotModule } from './modules/SlotModule.mjs';
import { NextBlockModule } from './modules/NextBlockModule.mjs';
import { NodeOneModule } from './modules/NodeOneModule.mjs';

class PumpFunSDK {
    program;
    connection;
    token;
    trade;
    pda;
    jito;
    astra;
    slot;
    nextBlock;
    nodeOne;
    events;
    constructor(provider, options) {
        this.program = new Program(IDL, provider);
        this.connection = this.program.provider.connection;
        // Initialize modules
        this.token = new TokenModule(this);
        this.trade = new TradeModule(this);
        this.events = new EventModule(this);
        this.pda = new PdaModule(this);
        if (options?.jitoUrl) {
            this.jito = new JitoModule(this, options.jitoUrl, options.authKeypair);
        }
        if (options?.astraKey) {
            if (!options.providerRegion) {
                throw new Error("Provider region is required for Astra module.");
            }
            this.astra = new AstraModule(this, options.providerRegion, options.astraKey);
        }
        if (options?.slotKey) {
            if (!options.providerRegion) {
                throw new Error("Provider region is required for 0Slot module.");
            }
            this.slot = new SlotModule(this, options.providerRegion, options.slotKey);
        }
        if (options?.nextBlockKey) {
            if (!options.providerRegion) {
                throw new Error("Provider region is required for NextBlock module.");
            }
            this.nextBlock = new NextBlockModule(this, options.providerRegion, options.nextBlockKey);
        }
        if (options?.nodeOneKey) {
            if (!options.providerRegion) {
                throw new Error("Provider region is required for NodeOne module.");
            }
            this.nodeOne = new NodeOneModule(this, options.providerRegion, options.nodeOneKey);
        }
    }
}

export { PumpFunSDK };
//# sourceMappingURL=PumpFunSDK.mjs.map
