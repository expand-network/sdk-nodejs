// Import the multiple different web3 libraries
const EvmWeb = require('web3');
const solanaWeb = require('@solana/web3.js');
const TronWeb = require('tronweb');
const nearApi = require('near-api-js');
const algosdk = require('algosdk');
const { SuiClient } = require('@mysten/sui/client');
const aptos = require('aptos');
const { TonClient, WalletContractV4, internal } = require("@ton/ton");
const { StargateClient } = require("@cosmjs/stargate");

const common = require('./common');
const config = require('./config.json');
const errorMessage = require('./errorMessage.json');


const invalidChainId = {
    'error': errorMessage.error.message.invalidChainId,
    'code': errorMessage.error.code.invalidInput
};

exports.initialiseWeb3 = async (data) => {
    /*
     * Initialise a web3 depending on the chain Id or chain Symbol
     *    
     */

    const chainId = await common.getChainId({
        chainId: data.chainId,
        chainSymbol: data.chainSymbol
    });

    let rpc;
    let chainName;

    try {
        rpc = data.rpc || config.chains[chainId].rpc;
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return (invalidChainId);
    }

    let web3;

    if (chainName === 'Evm') {

        web3 = new EvmWeb(rpc);

    } else if (chainName === 'Solana') {

        web3 = new solanaWeb.Connection(rpc);

    } else if (chainName === 'Tron') {

        const { HttpProvider } = TronWeb.providers;
        const fullNode = new HttpProvider(rpc);
        const solidityNode = new HttpProvider(rpc);
        const eventServer = new HttpProvider(rpc);
        web3 = new TronWeb(fullNode, solidityNode, eventServer);

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

    } else if (chainName === 'Sui') {

        web3 = new SuiClient({ url: config.chains[chainId].rpc });
    }
    else if (chainName === 'Aptos') {

        web3 = new aptos.AptosClient(rpc);

    } else if (chainName === 'TON') {

        web3 = new TonClient({
            endpoint: rpc,
            apiKey: config.chains[chainId].apiKey
        });
    } else if (chainName === 'Stellar') {
        web3 = new Horizon.Server(rpc);
    } else if (chainName === "Cosmos") {
        web3 = await StargateClient.connect(rpc);
    }

    return (web3);

};
