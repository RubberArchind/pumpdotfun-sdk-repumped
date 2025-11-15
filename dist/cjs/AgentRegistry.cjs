'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var http = require('http');
var https = require('https');
var pumpFun_consts = require('./pumpFun.consts.cjs');

class AgentRegistry {
    static agents = {};
    static config = new Map();
    /** Lazy-create & memoize */
    static get(key) {
        if (!this.agents[key]) {
            const config = this.config[key];
            const isHttps = config.port === 443;
            this.agents[key] = isHttps
                ? new https.Agent({
                    keepAlive: true,
                    keepAliveMsecs: 60_000,
                    maxSockets: 6, // tune per host
                    maxFreeSockets: 6,
                })
                : new http.Agent({
                    keepAlive: true,
                    keepAliveMsecs: 60_000,
                    maxSockets: 6, // tune per host
                    maxFreeSockets: 6,
                });
            // wireAgentDebug(this.agents[key]!, key);
        }
        return this.agents[key];
    }
    static registerInConfig(key, region) {
        if (this.config.has(key)) {
            throw new Error(`Host key ${key} is already registered.`);
        }
        switch (key) {
            case "slot":
                this.config.set(key, {
                    host: pumpFun_consts.SLOT_ENDPOINT_BY_REGION[region],
                    port: 80,
                });
                break;
            case "node":
                this.config.set(key, {
                    host: pumpFun_consts.NODE1_ENDPOINT_BY_REGION[region],
                    port: 80,
                });
                break;
            case "nextBlock":
                this.config.set(key, {
                    host: pumpFun_consts.NEXTBLOCK_ENDPOINT_BY_REGION[region],
                    port: 80,
                });
                break;
            case "astra":
                this.config.set(key, {
                    host: pumpFun_consts.ASTRA_ENDPOINT_BY_REGION[region],
                    port: 80,
                });
                break;
            default:
                throw new Error(`Unknown host key: ${key}`);
        }
    }
    static deleteFromConfig(key) {
        if (!this.config.has(key)) {
            throw new Error(`Host key ${key} is not registered.`);
        }
        this.config.delete(key);
        delete this.agents[key];
    }
    static target(key) {
        return this.config[key];
    }
    static callUpstream(key, path, options = {}) {
        return new Promise((resolve, reject) => {
            const { host, port } = this.target(key);
            const agent = this.get(key);
            const isHttps = port === 443;
            const requestOptions = {
                hostname: host,
                path: path,
                port: port,
                method: options.method || "GET",
                headers: options.headers || {},
                agent: agent,
                timeout: options.timeout || 5000, // 5 second timeout
            };
            const requestModule = isHttps ? https : http;
            const req = requestModule.request(requestOptions, (res) => {
                let data = "";
                res.on("data", (chunk) => {
                    data += chunk;
                });
                res.on("end", () => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(data);
                    }
                    else {
                        reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                    }
                });
            });
            req.on("socket", (sock) => {
                sock.setNoDelay(true);
            });
            req.on("error", (err) => {
                reject(err);
            });
            req.on("timeout", () => {
                req.destroy();
                reject(new Error("Request timeout"));
            });
            // Write body if provided
            if (options.body) {
                req.write(options.body);
            }
            req.end();
        });
    }
}

exports.default = AgentRegistry;
//# sourceMappingURL=AgentRegistry.cjs.map
