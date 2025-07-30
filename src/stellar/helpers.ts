import axios, { AxiosResponse } from 'axios';
import config from '../../configuration/config';

interface RequestBody {
    jsonrpc: string;
    id: number;
    method: string;
    params: {
        hash: string;
    };
}

interface TransactionResponse {
    [key: string]: any;
}

interface Config {
    chains: {
        [chainId: string]: {
            sorobanRpc: string;
        };
    };
}

function bufferToString(buffer: Buffer): string {
    return buffer.toString('utf-8');
}

async function getTransactionByHash(chainId: string, transactionHash: string): Promise<TransactionResponse> {
    const requestBody: RequestBody = {
        "jsonrpc": "2.0",
        "id": 8675309,
        "method": "getTransaction",
        "params": {
            "hash": transactionHash
        }
    };

    try {
        const res: AxiosResponse<TransactionResponse> = await axios.post(
            (config as Config).chains[chainId].sorobanRpc, 
            requestBody, 
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('Error making request:', error);
        throw error;
    }
}

export { getTransactionByHash, bufferToString };