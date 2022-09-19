const common = require('./common');
const config = require('./config.json');
const errorMessage = require('./errorMessage.json');

// Import the multiple different web3 libraries
const evmWeb = require('web3');
const solanaWeb = require('@solana/web3.js');
const TronWeb = require('tronweb');
const nearApi = require('near-api-js');
const algosdk=require('algosdk');

const invalidChainId = {
    'error': errorMessage.error.message.invalidChainId,
    'code': errorMessage.error.code.invalidInput
};

exports.initialiseWeb3 = async( data ) => {
    /*
     * Initialise a web3 depending on the chain Id or chain Symbol
     *    
     */

    var chainId = await common.getChainId({ 
        chainId: data.chainId, 
        chainSymbol: data.chainSymbol
    });

    try {
        var rpc = data.rpc || config.chains[chainId].rpc;
        var chainName = config.chains[chainId].chainName;
    } catch {
        return (invalidChainId);
    }

    var web3;

    if ( chainName == 'Evm' ) {
        
        web3 = new evmWeb(rpc);

    } else if ( chainName == 'Solana' ) {

        web3 = new solanaWeb.Connection(rpc);

    } else if ( chainName == 'Tron' ) {
        
        const HttpProvider = TronWeb.providers.HttpProvider;
        const fullNode = new HttpProvider(rpc);
        const solidityNode = new HttpProvider(rpc);
        const eventServer = new HttpProvider(rpc);
        web3 = new TronWeb(fullNode, solidityNode, eventServer);

    } else if ( chainName == 'Near' ) {
        
        web3 = await nearApi.connect({
            networkId: data.networkId,
            nodeUrl: rpc
        });

    } else if ( chainName == 'Algorand' ) {

        const token={
            "x-api-key": data.key // fill in yours
        };

        if ( data.connectionType == 'idx' ) {
            web3 = new algosdk.Indexer(token, rpc, "");
        } else {
            web3 = new algosdk.Algodv2(token, rpc , "");
        }

    }

    return (web3);

}