import dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import config from '../configuration/config.json';
import { WalletPhantom } from "../src/index";

// Initialize environment variables
dotenv.config();

// Type definitions
interface Config {
    url: {
        apiurl: string;
    };
    [key: string]: any;
}

interface Headers {
    'x-api-key': string;
    [key: string]: string;
}

interface ApproveParams {
    from: string;
    tokenAddress: string;
    amount: string;
    to: string;
    gas: string;
    chainId: string;
}

interface SwapParams {
    dexId: string;
    amountIn: string;
    amountOutMin: string;
    path: string[];
    to: string;
    deadline: string;
    from: string;
    gas: string;
    involveBaseToken: string;
}

interface TransactionResponse {
    data: {
        data: any;
        [key: string]: any;
    };
    [key: string]: any;
}

// Configuration
const expand_url: string = config.url.apiurl;
const chainId: string = "1";
const headers: Headers = { 'x-api-key': process.env.xApiKey || '' };
const wallet = new WalletPhantom({
    privateKey: process.env.WALLET_PRIVATE_KEY || '',
    xApiKey: process.env.xApiKey || ''
});

async function getApproveTx(options: ApproveParams): Promise<any> {
    try {
        const rawApprovedTx: AxiosResponse = await axios.post(
            `${expand_url}fungibletoken/approve`, 
            options, 
            { headers }
        );
        return rawApprovedTx.data.data;
    } catch (error) {
        console.error("Error in getApproveTx:", error);
        throw error;
    }
}

async function getSwapTransaction(options: SwapParams): Promise<any> {
    try {
        const rawSwapTx: AxiosResponse = await axios.post(
            `${expand_url}dex/swap`, 
            options, 
            { headers }
        );
        return rawSwapTx.data.data;
    } catch (error) {
        console.error("Error in getSwapTransaction:", error);
        throw error;
    }
}

async function getFeeTx(swapTx: any): Promise<any> {
    try {
        const feeTx: AxiosResponse = await axios.post(
            `${expand_url}chain/createfeetransaction`, 
            swapTx, 
            { headers }
        );
        return feeTx.data.data;
    } catch (error) {
        console.error("Error in getFeeTx:", error);
        throw error;
    }
}

async function main(): Promise<void> {
    try {
        const approveParams: ApproveParams = {
            "from": "<Wallet address>",
            "tokenAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            "amount": "1000000000000000000000",
            "to": "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45", 
            "gas": "100000",
            "chainId": "1"
        };

        const swapParams: SwapParams = {
            "dexId": "1300",
            "amountIn": "1000000000000000",
            "amountOutMin": "0",
            "path": [
                "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                "0x6B175474E89094C44Da98b954EedeAC495271d0F"
            ],
            "to": "<Wallet address>",
            "deadline": "1965990894",
            "from": "<Wallet address>",
            "gas": "203376",
            "involveBaseToken": "1"
        };

        // Prepare the Approved transaction
        const approvedTx = await getApproveTx(approveParams);
        console.log("approvedTx --", approvedTx);

        // Prepare the swap transaction
        const swapTx = await getSwapTransaction(swapParams);
        console.log("swapTx --", swapTx);

        const feeTx = await getFeeTx(swapTx);
        console.log("feeTx --", feeTx);

        // const executeBatchCall = await wallet.signSendBatchTransactions({
        //     chainId, 
        //     transactions: [approvedTx, swapTx, feeTx]
        // });
        // console.log("executeBatch --", executeBatchCall);
    } catch (error) {
        console.error("Error in main:", error);
    }
}

main().catch(console.error);