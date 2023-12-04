const { default: axios } = require('axios');
const config = require("../../configuration/config.json");
const { initialiseWeb3 } = require('../../configuration/intialiseWeb3');

module.exports = {
    deposit: async (options) => {
        const { srcChainId: fromChain, from: fromAddress, to: toAddress, amountIn: fromAmount, tokenIn: fromToken, slippage, gas, privateKey } = options;
        const web3 = await initialiseWeb3({ chainId: fromChain });
        const routeURL = `${config.dYdXV4.squidRouterAPIBaseUrl}route`;
        const apiConfig = {
            method: 'get',
            url: `${config.dYdXV4.squidRouterAPIBaseUrl}route`,
            headers: {},
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
        };

        console.log(apiConfig);
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
                },
                headers: {
                    "x-integrator-id": "your-integrator-id",
                }
            });

            const {gasPrice, data, targetAddress: to, value} = result.data.route.transactionRequest;
            const createTransaction = await web3.eth.accounts.signTransaction({
                from: fromAddress,
                gas,
                gasPrice,
                data,
                value,
                to,
              }, privateKey);

            const transactionReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
            return transactionReceipt;
        } catch (err) {
            console.log(err.response.data);
            return '0';
        }
    }
};
