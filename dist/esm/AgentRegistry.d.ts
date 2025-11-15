import { HostKey, Region } from "./pumpFun.types.js";
import http from "http";
declare class AgentRegistry {
    private static agents;
    private static config;
    /** Lazy-create & memoize */
    static get(key: HostKey): http.Agent;
    static registerInConfig(key: HostKey, region: Region): void;
    static deleteFromConfig(key: HostKey): void;
    static target(key: HostKey): any;
    static callUpstream(key: HostKey, path: string, options?: {
        method?: string;
        headers?: Record<string, string | number>;
        body?: string;
        timeout?: number;
    }): Promise<string>;
}
export default AgentRegistry;
//# sourceMappingURL=AgentRegistry.d.ts.map