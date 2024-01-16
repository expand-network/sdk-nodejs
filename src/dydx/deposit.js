const { default: axios } = require('axios');
const config = require("../../configuration/config.json");
const tokenConfig = require("../../configuration/squidRouterTokenConfig.json");
const { Wallet } = require('../adapters/Wallet');
const dotenv = require('dotenv').config();
const errorMessage = require('../../configuration/errorMessage.json');

module.exports = {
    deposit: async (options) => {
        const { srcChainId: fromChain, from: fromAddress, to: toAddress, amountIn: fromAmount, tokenIn, slippage, gas, privateKey } = options;
        const fromToken = tokenConfig[fromChain][tokenIn.toUpperCase()];

        if (fromToken === undefined) return {
            'message': errorMessage.error.message.invalidSrcToken,
            'code': errorMessage.error.code.invalidInput
        };

        const routeURL = `${config.dYdXV4.squidRouterAPIBaseUrl}route`;
        
        try {
            const result = await axios.get(routeURL, {
                params: {
                    fromChain,
                    fromToken,
                    fromAddress,
                    fromAmount,
                    toChain: config.dYdXV4.chainId,
                    toToken: config.dYdXV4.USDC,
                    toAddress,
                    slippage,
                    quoteOnly: false
                }
            });

            const { gasPrice, data, targetAddress: to, value } = result.data.route.transactionRequest;
            const wallet = new Wallet({
                privateKey,
                xApiKey: process.env.xApiKey
            });

            const createTransaction = await wallet.signTransaction({
                chainId: fromChain,
                from: fromAddress,
                gas,
                gasPrice,
                data,
                value,
                to,
            });

            const transactionReceipt = await wallet.sendTransaction(createTransaction);

            return transactionReceipt;
        } catch (err) {
            return (err.response.data);
        }
    }
};
