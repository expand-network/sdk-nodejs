const rawTransaction = require('./signTransaction/index');
const config = require('../configuration/config.json');
const common = require('../configuration/common');
const axios = require('axios').default;
const {initialiseWeb3} = require('../configuration/intialiseWeb3');

axios.defaults.headers['X-API-KEY'] = config.url['x-api-key'];


exports.prepareTransaction = async(apiURL, options) => {

    try {

        const config = {
            method: "post",
            url: apiURL,
            data: options
            
        }

        const response = await axios(config).then(response => response.data);
        response.value = Number(response.value);
        return response;

    }
    catch(error){
        return error;
    }

}

exports.signTransaction = async(transactionObject, options) => {

    const apiURL = config.url.apiurl + '/chain/getpublicrpc/';

    var configuration = {};

    var chainId = await common.getChainId({chainId:options.chainId,chainSymbol:options.chainSymbol});
    
    configuration.params = {
        chainId: chainId
    }

    var rpc = await axios.get(apiURL, configuration);
    options.rpc = rpc.data.rpc;
    web3 = await initialiseWeb3({rpc:options.rpc,chainId:chainId,key:options.key});
    transactionObject.value = Number(transactionObject.value);

    try {
        var chainName = config.chains[chainId].chainName;
    }
    catch(error) {
        return error;
    }


    var rawData = await rawTransaction['signTransaction' + chainName](web3,transactionObject,options);

    return rawData;

}

exports.sendTransaction = async(options) => {

    try {

        const apiURL = config.url.apiurl + '/chain/sendtransaction/';
        
        const params = {
            method: "post",
            url: apiURL,
            data: options,
            headers: {
                "x-api-key" : config.url['x-api-key']
              }
        };
    
        const transactionHash = await axios(params);
        return transactionHash;    

    }

    catch(error){
        return error;
    }

}



