
module.exports = {



    signTransactionEvm: async (transactionObject, options) => {
        /*
         * Function will sign the transaction payload for ethereum based chains
         */

        try {
            // console.log(await options.wallet.getAddress());
            const tx = {
                nonce: await (options.rpcProvider).getTransactionCount(options.wallet.getAddress(), "latest"),
                to: transactionObject.to,
                data: transactionObject.data,
                value: transactionObject.value,
                gas: transactionObject.gas,
                chainId: transactionObject.chainId,
                maxFeePerGas: '120000000000',
                maxPriorityFeePerGas: '120000000000',
                gasLimit: transactionObject.gas
            };
            let signedTx = await (options.wallet).signTransaction(tx);
            const response = { rawTransaction: signedTx }
            return response;


        }
        catch (error) {
            return (error);
        }

    }

};
