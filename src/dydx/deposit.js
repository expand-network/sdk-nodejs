// const { default: axios } = require('axios');

// module.exports = {
//     deposit: async (options) => {
//         const {srcChainId, from, to, srcToken} = options;
//         const apiConfig = {
//             method: 'post',
//             url: `https://testnet.api.squidrouter.com/v1/route`,
//             headers: {},
//         data: {
//             fromChain: srcChainId, // Avalanche
//             toChain: 'dydx-testnet-4', // dydx
//             fromToken: srcToken,
//             toToken: "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
//             fromAmount: "100000000000000000", // 0.1 AVAX
//             fromAddress: from,
//             toAddress: to,
//             slippageConfig: {
//               autoMode: 1
//             }
//           }
//         };

//           try {
//             const res = await axios.request(apiConfig);
//             console.log(res);
//         } catch (err) {
//             return err;
//         }        
//     }
// };
