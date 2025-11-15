'use strict';

var anchor = require('@coral-xyz/anchor');
var pumpFun = require('./IDL/pump-fun.json.cjs');
var EventModule = require('./modules/EventModule.cjs');
var TokenModule = require('./modules/TokenModule.cjs');
var TradeModule = require('./modules/TradeModule.cjs');
var PdaModule = require('./modules/PdaModule.cjs');
var JitoModule = require('./modules/JitoModule.cjs');
var AstraModule = require('./modules/AstraModule.cjs');
var SlotModule = require('./modules/SlotModule.cjs');
var NextBlockModule = require('./modules/NextBlockModule.cjs');
var NodeOneModule = require('./modules/NodeOneModule.cjs');

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
        this.program = new anchor.Program(pumpFun.default, provider);
        this.connection = this.program.provider.connection;
        // Initialize modules
        this.token = new TokenModule.TokenModule(this);
        this.trade = new TradeModule.TradeModule(this);
        this.events = new EventModule.EventModule(this);
        this.pda = new PdaModule.PdaModule(this);
        if (options?.jitoUrl) {
            this.jito = new JitoModule.JitoModule(this, options.jitoUrl, options.authKeypair);
        }
        if (options?.astraKey) {
            if (!options.providerRegion) {
                throw new Error("Provider region is required for Astra module.");
            }
            this.astra = new AstraModule.AstraModule(this, options.providerRegion, options.astraKey);
        }
        if (options?.slotKey) {
            if (!options.providerRegion) {
                throw new Error("Provider region is required for 0Slot module.");
            }
            this.slot = new SlotModule.SlotModule(this, options.providerRegion, options.slotKey);
        }
        if (options?.nextBlockKey) {
            if (!options.providerRegion) {
                throw new Error("Provider region is required for NextBlock module.");
            }
            this.nextBlock = new NextBlockModule.NextBlockModule(this, options.providerRegion, options.nextBlockKey);
        }
        if (options?.nodeOneKey) {
            if (!options.providerRegion) {
                throw new Error("Provider region is required for NodeOne module.");
            }
            this.nodeOne = new NodeOneModule.NodeOneModule(this, options.providerRegion, options.nodeOneKey);
        }
    }
}

exports.PumpFunSDK = PumpFunSDK;
//# sourceMappingURL=PumpFunSDK.cjs.map
