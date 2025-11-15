import { AnchorProvider } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import bs58 from "bs58";
import { PumpFunSDK, TOKEN_2022_PROGRAM_ID, LEGACY_TOKEN_PROGRAM_ID } from "../src";

const connection = new Connection("https://api.mainnet-beta.solana.com", "finalized");

/**
 * Check if a token has migrated to Raydium (bonding curve complete)
 * Tries both legacy and Token2022 token programs
 */
async function isRaydiumLegacyFirst(mint: string): Promise<boolean> {
    try {
        const secretKeyBase58 = bs58.encode([180, 60, 253, 69, 193, 224, 197, 142, 94, 143, 130, 39, 207, 91, 245, 97, 39, 87, 126, 102, 119, 78, 87, 110, 58, 111, 69, 181, 8, 235, 0, 150, 154, 196, 147, 212, 129, 166, 107, 155, 12, 211, 30, 76, 187, 88, 135, 133, 125, 232, 250, 194, 89, 222, 238, 124, 167, 185, 55, 188, 251, 134, 152, 30]);
        const privateKey = bs58.decode(secretKeyBase58);
        const fromKeypair = Keypair.fromSecretKey(privateKey);
        let getProvider = () => {
            const wallet = new NodeWallet(fromKeypair);
            return new AnchorProvider(connection, wallet, { commitment: "finalized" });
        };
        const provider = getProvider();
        const sdk = new PumpFunSDK(provider);

        const mintPubkey = new PublicKey(mint);
        let bondingCurveAccount;

        // Try legacy token first (most common)
        try {
            console.log("Trying legacy token program...");
            bondingCurveAccount = await sdk.token.getBondingCurveAccount(mintPubkey);
            console.log("Legacy bonding curve account found:", bondingCurveAccount);
        } catch (error) {
            console.log("Legacy failed, trying Token2022...");
            try {
                bondingCurveAccount = await sdk.token.getBondingCurveAccount(mintPubkey, TOKEN_2022_PROGRAM_ID);
                console.log("Token2022 bonding curve account found:", bondingCurveAccount);
            } catch (error2) {
                console.log("Token2022 also failed:", error2);
                throw error2; // Re-throw to outer catch
            }
        }

        if (bondingCurveAccount) {
            // complete = true means migrated to Raydium
            console.log("Bonding curve complete:", bondingCurveAccount.complete);
            return bondingCurveAccount.complete ?? false;
        } else {
            // No bonding curve account found = already on Raydium
            console.log("No bonding curve account found");
            return true;
        }
    } catch (error) {
        console.error("Error checking Raydium status (both token programs failed):", error);
        // If both token programs fail, token doesn't exist or error occurred
        throw error;
    }
}

/**
 * Check if a token has migrated to Raydium (bonding curve complete)
 * Determines token program by checking mint account owner
 */
async function isRaydiumSmartDetect(mint: string): Promise<boolean> {
    try {
        const secretKeyBase58 = bs58.encode([180, 60, 253, 69, 193, 224, 197, 142, 94, 143, 130, 39, 207, 91, 245, 97, 39, 87, 126, 102, 119, 78, 87, 110, 58, 111, 69, 181, 8, 235, 0, 150, 154, 196, 147, 212, 129, 166, 107, 155, 12, 211, 30, 76, 187, 88, 135, 133, 125, 232, 250, 194, 89, 222, 238, 124, 167, 185, 55, 188, 251, 134, 152, 30]);
        const privateKey = bs58.decode(secretKeyBase58);
        const fromKeypair = Keypair.fromSecretKey(privateKey);
        let getProvider = () => {
            const wallet = new NodeWallet(fromKeypair);
            return new AnchorProvider(connection, wallet, { commitment: "finalized" });
        };
        const provider = getProvider();
        const sdk = new PumpFunSDK(provider);

        const mintPubkey = new PublicKey(mint);
        
        // Get mint account to determine token program
        const mintAccount = await connection.getAccountInfo(mintPubkey);
        if (!mintAccount) {
            console.log("No mint account found");
            throw new Error("Mint account not found");
        }
        
        const tokenProgram = mintAccount.owner.equals(TOKEN_2022_PROGRAM_ID) 
            ? TOKEN_2022_PROGRAM_ID 
            : LEGACY_TOKEN_PROGRAM_ID;
        
        console.log("Token program:", tokenProgram.toBase58());
        
        // Calculate and log the PDA
        const bondingCurvePDA = sdk.pda.getBondingCurvePDA(mintPubkey, tokenProgram);
        console.log("Bonding curve PDA:", bondingCurvePDA.toBase58());
        
        // Check if PDA account exists
        const pdaAccount = await connection.getAccountInfo(bondingCurvePDA);
        console.log("PDA account exists:", !!pdaAccount);
        if (pdaAccount) {
            console.log("PDA account size:", pdaAccount.data.length);
            console.log("PDA account owner:", pdaAccount.owner.toBase58());
        }
        
        console.log("Fetching bonding curve account...");
        let bondingCurveAccount = await sdk.token.getBondingCurveAccount(mintPubkey, tokenProgram);

        if (bondingCurveAccount) {
            // complete = true means migrated to Raydium
            console.log("Bonding curve account found:", bondingCurveAccount);
            console.log("Bonding curve complete:", bondingCurveAccount.complete);
            return bondingCurveAccount.complete ?? false;
        } else {
            // No bonding curve account found = already on Raydium
            console.log("No bonding curve account found");
            return true;
        }
    } catch (error) {
        console.error("Error checking Raydium status:", error);
        throw error;
    }
}

async function main() {
    // Test with a known pump.fun token mint  
    const testMint = "7Ejqa5vWAHZvjPckJjBvX3dNN3mv5BDZ3jVaUDMwpump"; // Replace with actual token mint
    
    console.log(`\nChecking token: ${testMint}`);
    console.log("Solana Explorer: https://solscan.io/token/" + testMint);
    
    console.log("\nTesting isRaydiumLegacyFirst approach...");
    try {
        const result1 = await isRaydiumLegacyFirst(testMint);
        console.log(`Token ${testMint} on Raydium: ${result1}`);
    } catch (error: any) {
        console.log("Failed:", error.message);
    }
    
    console.log("\nTesting isRaydiumSmartDetect approach...");
    try {
        const result2 = await isRaydiumSmartDetect(testMint);
        console.log(`Token ${testMint} on Raydium: ${result2}`);
    } catch (error: any) {
        console.log("Failed:", error.message);
    }
}

main().catch(console.error);
