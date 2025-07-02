import EvmWeb from 'web3';
import { Connection } from '@solana/web3.js';
import TronWeb, { providers } from 'tronweb';
import * as nearApi from 'near-api-js';
import * as algosdk from 'algosdk';
import { SuiClient } from '@mysten/sui/client';
import { AptosClient } from 'aptos';
import { TonClient } from "@ton/ton";
import { StargateClient } from "@cosmjs/stargate";
import { Horizon } from 'stellar-sdk';

import * as common from './common';
import config from './config';
import errorMessage from './errorMessage.json';

// Define interfaces for your data structures
interface InitializeWeb3Data {
    chainId?: string | number;
    chainSymbol?: string;
    rpc?: string;
    networkId?: string;
    key?: string;
    connectionType?: string;
}

interface ErrorResponse {
    error: string;
    code: string | number;
}

interface ChainConfig {
     localName: string;
    chainName: string;
    chainSymbol: string;
    rpc?: string;
    apiKey?: string;
}

interface RpcUrls {
    [key: string]: string;
}


interface Config {
    chains: {
        [key: string]: ChainConfig;
    };
    rpc_url: RpcUrls;
}

// Type for the web3 instance which can be any of the supported clients
type Web3Instance = 
    | EvmWeb 
    | Connection 
    | TronWeb 
    | nearApi.Near 
    | algosdk.Algodv2 
    | algosdk.Indexer 
    | SuiClient 
    | AptosClient 
    | TonClient 
    | Horizon.Server 
    | StargateClient;

const invalidChainId: ErrorResponse = {
    error: errorMessage.error.message.invalidChainId,
    code: errorMessage.error.code.invalidInput
};

export const initialiseWeb3 = async (data: InitializeWeb3Data): Promise<Web3Instance | ErrorResponse> => {
    /*
     * Initialise a web3 depending on the chain Id or chain Symbol
     */
    const chainId = await common.getChainId({
        chainId: data.chainId,
        chainSymbol: data.chainSymbol
    });

    if(!chainId){
      return invalidChainId;
    }

    let rpc: any;
    let chainName: any;

    try {
      rpc = data.rpc || config.chains[chainId].rpc;
      chainName = config.chains[chainId].chainName;
    } catch (error) {
      return invalidChainId;
    }

    let web3: any;

    if (chainName === 'Evm') {
        web3 = new EvmWeb(rpc);
    } else if (chainName === 'Solana') {
        web3 = new Connection(rpc);
    } else if (chainName === 'Tron') {
        const { HttpProvider } = providers;
        const fullNode = new HttpProvider(rpc);
        const solidityNode = new HttpProvider(rpc);
        const eventServer = new HttpProvider(rpc);
        web3 = new TronWeb(fullNode, solidityNode, eventServer);
    } else if (chainName === 'Near') {
        web3 = await nearApi.connect({
            networkId: data.networkId || '',
            nodeUrl: rpc
        });
    } else if (chainName === 'Algorand') {
        const token = {
            "x-api-key": data.key || '' 
        };

        if (data.connectionType === 'idx') {
            web3 = new algosdk.Indexer(token, rpc, "");
        } else {
            web3 = new algosdk.Algodv2(token, rpc, "");
        }
    } else if (chainName === 'Sui') {
        web3 = new SuiClient({ url: config.chains[chainId].rpc || '' });
    } else if (chainName === 'Aptos') {
        web3 = new AptosClient(rpc);
    } else if (chainName === 'TON') {
        web3 = new TonClient({
            endpoint: rpc,
            apiKey: config.chains[chainId].apiKey
        });
    } else if (chainName === 'Stellar') {
        web3 = new Horizon.Server(rpc);
    } else if (chainName === "Cosmos") {
        web3 = await StargateClient.connect(rpc);
    } else {
        return invalidChainId;
    }

    return web3;
};