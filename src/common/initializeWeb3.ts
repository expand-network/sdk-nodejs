// Import the multiple different web3 libraries

import evmWeb from 'web3';
import solanaWeb from '@solana/web3.js';
import tronWeb from 'tronweb';
import nearApi from 'near-api-js';
import algosdk from 'algosdk';
import common from './common';
import config from '../configuration/config';
import errorMessage from '../configuration/errorMessage';

const invalidChainId = {
    'error': errorMessage.message.invalidChainId,
    'code': errorMessage.code.invalidInput
};

class IntializeWeb3 {
    initialiseWeb3 = async (data: any) => {
        /*
         * Initialise a web3 depending on the chain Id or chain Symbol
         *    
         */
        const chainId = await common.getChainId({
            chainId: data.chainId,
            chainSymbol: data.chainSymbol
        });

        let rpc: any;
        let chainName: any;

        try {
            rpc = data.rpc || config.chains[chainId].rpc;
            chainName = config.chains[chainId].chainName;
        } catch (error) {
            return (invalidChainId);
        }

        let web3: any;

        if (chainName === 'Evm') {

            web3 = new evmWeb(rpc);

        } else if (chainName === 'Solana') {

            web3 = new solanaWeb.Connection(rpc);

        } else if (chainName === 'Tron') {

            const { HttpProvider } = tronWeb.providers;
            const fullNode = new HttpProvider(rpc);
            const solidityNode = new HttpProvider(rpc);
            const eventServer = new HttpProvider(rpc);
            web3 = new tronWeb(fullNode, solidityNode, eventServer);

        } else if (chainName === 'Near') {

            web3 = await nearApi.connect({
                networkId: data.networkId,
                nodeUrl: rpc
            });

        } else if (chainName === 'Algorand') {

            const token = {
                "x-api-key": data.key // fill in yours
            };

            if (data.connectionType === 'idx') {
                web3 = new algosdk.Indexer(token, rpc, "");
            } else {
                web3 = new algosdk.Algodv2(token, rpc, "");
            }

        }

        return (web3);

    };
}

export default new IntializeWeb3();
