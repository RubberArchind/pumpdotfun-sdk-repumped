'use strict';

var splToken = require('@solana/spl-token');
var web3_js = require('@solana/web3.js');
var pumpFun_consts = require('../pumpFun.consts.cjs');
var BondingCurveAccount = require('../BondingCurveAccount.cjs');
var GlobalAccount = require('../GlobalAccount.cjs');
var FeeConfig = require('../FeeConfig.cjs');

class TokenModule {
    sdk;
    constructor(sdk) {
        this.sdk = sdk;
    }
    async createTokenMetadata(create) {
        // Validate file
        if (!(create.file instanceof Blob)) {
            throw new Error("File must be a Blob or File object");
        }
        let formData = new FormData();
        formData.append("file", create.file, "image.png"); // Add filename
        formData.append("name", create.name);
        formData.append("symbol", create.symbol);
        formData.append("description", create.description);
        formData.append("twitter", create.twitter || "");
        formData.append("telegram", create.telegram || "");
        formData.append("website", create.website || "");
        formData.append("showName", "true");
        try {
            const request = await fetch("https://pump.fun/api/ipfs", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: formData,
                credentials: "same-origin",
            });
            if (request.status === 500) {
                // Try to get more error details
                const errorText = await request.text();
                throw new Error(`Server error (500): ${errorText || "No error details available"}`);
            }
            if (!request.ok) {
                throw new Error(`HTTP error! status: ${request.status}`);
            }
            const responseText = await request.text();
            if (!responseText) {
                throw new Error("Empty response received from server");
            }
            try {
                return JSON.parse(responseText);
            }
            catch (e) {
                throw new Error(`Invalid JSON response: ${responseText}`);
            }
        }
        catch (error) {
            console.error("Error in createTokenMetadata:", error);
            throw error;
        }
    }
    async createAssociatedTokenAccountIfNeeded(payer, owner, mint, transaction, commitment = pumpFun_consts.DEFAULT_COMMITMENT) {
        const associatedTokenAccount = await splToken.getAssociatedTokenAddress(mint, owner, false);
        try {
            await splToken.getAccount(this.sdk.connection, associatedTokenAccount, commitment);
        }
        catch (e) {
            transaction.add(splToken.createAssociatedTokenAccountInstruction(payer, associatedTokenAccount, owner, mint));
        }
        return associatedTokenAccount;
    }
    async getBondingCurveAccount(mint, commitmentOrTokenProgram, commitment = pumpFun_consts.DEFAULT_COMMITMENT) {
        // Handle overloaded parameters - if second param is PublicKey, it's tokenProgram
        let tokenProgram;
        let actualCommitment;
        if (commitmentOrTokenProgram instanceof web3_js.PublicKey) {
            tokenProgram = commitmentOrTokenProgram;
            actualCommitment = commitment;
        }
        else {
            tokenProgram = undefined;
            actualCommitment = commitmentOrTokenProgram || commitment;
        }
        const tokenAccount = await this.sdk.connection.getAccountInfo(this.sdk.pda.getBondingCurvePDA(mint, tokenProgram), actualCommitment);
        if (!tokenAccount) {
            return null;
        }
        // Note: Bonding curve accounts do NOT have the 8-byte Anchor discriminator
        // Parse the data directly without skipping bytes
        return BondingCurveAccount.BondingCurveAccount.fromBuffer(tokenAccount.data);
    }
    async getGlobalAccount(commitment = pumpFun_consts.DEFAULT_COMMITMENT) {
        const globalAccountPDA = this.sdk.pda.getGlobalAccountPda();
        const tokenAccount = await this.sdk.connection.getAccountInfo(globalAccountPDA, commitment);
        // Skip 8-byte Anchor discriminator
        const accountData = tokenAccount.data.subarray(8);
        return GlobalAccount.GlobalAccount.fromBuffer(accountData);
    }
    async getFeeConfig(commitment = pumpFun_consts.DEFAULT_COMMITMENT) {
        const feePda = this.sdk.pda.getPumpFeeConfigPda();
        // @ts-ignore: feeConfig account is missing in generated Anchor types
        const anchorFee = await this.sdk.program.account.feeConfig.fetch(feePda);
        return FeeConfig.FeeConfig.convert(anchorFee);
    }
    async getBondingCurveCreator(bondingCurvePDA, commitment = pumpFun_consts.DEFAULT_COMMITMENT) {
        const bondingAccountInfo = await this.sdk.connection.getAccountInfo(bondingCurvePDA, commitment);
        if (!bondingAccountInfo) {
            throw new Error("Bonding curve account not found");
        }
        // Creator is at offset 49 (after 8 bytes discriminator, 5 u64 fields, and 1 byte boolean)
        const creatorBytes = bondingAccountInfo.data.subarray(49, 49 + 32);
        return new web3_js.PublicKey(creatorBytes);
    }
}

exports.TokenModule = TokenModule;
//# sourceMappingURL=TokenModule.cjs.map
