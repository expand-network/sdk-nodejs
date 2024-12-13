const axios = require('axios').default;
const config = require('../configuration/config.json');
const schemaValidator = require('../configuration/schemaValidator');
const { Wallet, WalletFordefi, WalletDFNS, WalletTON, 
        WalletFireblocks, WalletPhantom, WalletCoinbase, 
        WalletCircle, WalletCosmos, WalletStellar, WalletXRPL, WalletBitcoin, WalletStacks } = require('./interfaces/index');

exports.prepareTransaction = async (apiURL, options) => {

    const filterOptions = options;
    filterOptions.function = "prepareTransaction()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
        return (validJson);
    }

    const { chainId, xApiKey } = filterOptions;
    try {
        const paramConfig = {
            method: "post",
            url: apiURL,
            data: filterOptions,
            headers: {
                "x-api-key": xApiKey
            }

        };

        const response = await axios(paramConfig).then(result => result.data);
        if (chainId) response.data.chainId = chainId;
        return response.data;

    }
    catch (error) {
        return error;
    }
};


exports.decodeTransaction = async (options) => {

    const filterOptions = options;
    filterOptions.function = "decodeTransaction()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
        return (validJson);
    }

    try {
        const apiURL = `${config.url.apiurl}/chain/decodetransaction/`;

        const paramConfig = {
            method: "post",
            url: apiURL,
            data: filterOptions,
            headers: {
                "x-api-key": filterOptions.xApiKey
            }
        };

        const response = await axios(paramConfig).then(result => result.data);
        return response.data;

    } catch (error) {
        return error;
    }
};


exports.Wallet = Wallet;

exports.WalletFordefi = WalletFordefi;

exports.WalletDFNS = WalletDFNS;

exports.WalletPhantom = WalletPhantom;

exports.WalletCoinbase = WalletCoinbase;

exports.WalletTON = WalletTON;

exports.WalletFireblocks = WalletFireblocks;

exports.WalletCircle = WalletCircle;

exports.WalletStellar = WalletStellar;

exports.WalletXRPL = WalletXRPL;

exports.WalletCosmos = WalletCosmos;

exports.WalletStacks = WalletStacks;

exports.WalletBitcoin = WalletBitcoin;
