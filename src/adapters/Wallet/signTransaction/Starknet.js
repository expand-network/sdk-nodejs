// const starknet = require('starknet');
// const BN = require("bn.js");
// const config = require('../../../../configuration/config.json');
// const { callsToArrayData } = require('../../../helper/Starknet');
// const starkNetNativeEthAbi = require('../../../../assets/abis/starknetNativeEth.json');
const errorMessage = require('../../../../configuration/errorMessage.json');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    signTransactionStarkNet: async (web3, transactionObject, options) => {
        /*
         * Function will sign the transaction payload for Near chain
         */

        // const hexCallData = {};
        // let estimateFee = '';

        // try {
        //     // const starkKeyPair = starknet.ec.getKeyPair(options.privateKey);
        //     const userAddress = transactionObject.from;
        //     // const signer = new starknet.Signer(starkKeyPair);

        //     const rpcProvider = new starknet.RpcProvider({
        //         nodeUrl: config.chains[options.chainId].rpc,
        //     });

        //     // console.log(await rpcProvider.getChainId());
        //     const chainId = await rpcProvider.getChainId();
        //     const account = new starknet.Account(rpcProvider, transactionObject.from, options.privateKey);

        //     const currentNonce = BigInt(await account.getNonce());
        //     const { nativeEthAddress } = config.chains[options.chainId];
        //     const contract = new starknet.Contract(starkNetNativeEthAbi, nativeEthAddress, rpcProvider);

        //     contract.connect(account);
        //     const value = parseInt(transactionObject.value);
        //     if (options.gas !== undefined && Number(options.gas) !== 0) {
        //         estimateFee = options.gas;
        //     }
        //     else {
        //         estimateFee = await account.estimateInvokeFee({
        //             contractAddress: nativeEthAddress,  // ETH contract address
        //             entrypoint: 'transfer',
        //             calldata: starknet.CallData.compile(
        //                 {
        //                     recipient: transactionObject.to,
        //                     amount: {
        //                         low: value,  // 1 wei
        //                         high: '0',
        //                     }
        //                 }
        //             ),
        //         }).then(res => res.suggestedMaxFee.toString());

        //     }

        //     const signedTransaction = await account.signer.signTransaction([{
        //         contractAddress: nativeEthAddress,  // ETH contract address
        //         entrypoint: 'transfer',
        //         calldata: starknet.CallData.compile(
        //             {
        //                 recipient: transactionObject.to,
        //                 amount: {
        //                     low: value,   // 1 wei
        //                     high: '0',
        //                 }
        //             }
        //         ),
        //     }],
        //         {
        //             walletAddress: userAddress,
        //             nonce: new BN(currentNonce),
        //             maxFee: estimateFee,
        //             version: new BN(1),
        //             chainId
        //         },
        //         undefined);

        //     const finalSignedData = [signedTransaction.r, signedTransaction.s];

        //     const callDataInitial = ({
        //         contractAddress: userAddress,
        //         calldata: await callsToArrayData([{
        //             contractAddress: nativeEthAddress,
        //             entrypoint: 'transfer',
        //             calldata: starknet.CallData.compile(
        //                 {
        //                     recipient: transactionObject.to,
        //                     amount: {
        //                         low: value,
        //                         high: '0',
        //                     }
        //                 })
        //         }]),
        //         signature: finalSignedData
        //     });

        //     for (const key in callDataInitial) {
        //         if (key === 'contractAddress') {
        //             hexCallData[key] = (callDataInitial[key]).toLowerCase();
        //         }
        //         else if (Array.isArray(callDataInitial[key])) {
        //             hexCallData[key] = callDataInitial[key].map(val => `0x${BigInt(val).toString(16)}`);
        //         } else {
        //             hexCallData[key] = `0x${BigInt(callDataInitial[key]).toString(16)}`;
        //         }
        //     }

        //     const finalCallData = {
        //         invoke_transaction: {
        //             sender_address: hexCallData.contractAddress,
        //             calldata: hexCallData.calldata,
        //             type: "INVOKE",
        //             max_fee: `0x${BigInt(estimateFee).toString(16)}`,
        //             version: `0x${BigInt(1).toString(16)}`,
        //             signature: hexCallData.signature,
        //             nonce: `0x${BigInt(currentNonce).toString(16)}`
        //         }
        //     };

        //     const rawTransaction = Buffer.from(JSON.stringify(finalCallData)).toString("base64");

        //     return { "rawTransaction": rawTransaction };

        // }
        // catch (error) {
        //     return error;
        // }

        return throwErrorMessage("notApplicable");

    }
};
