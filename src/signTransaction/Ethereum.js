/* eslint-disable no-await-in-loop */
// const Web3 = require('web3');
const Common = require('../../configuration/common');
const aaveV3AToken = require('../../assets/abis/aaveV3AToken.json');

module.exports = {



    signTransactionEvm: async (web3, transactionObject, options) => {
        /*
         * Function will sign the transaction payload for ethereum based chains
         */

        try {

            if ((transactionObject.data).includes("0x")) {
                const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, options.privateKey);
                return (signedTransaction);
            }
            else {
                const permitData = [];
                const decodedData = JSON.parse(Buffer.from((transactionObject.data), "base64"));
                const permits = decodedData[2];
                for (let i = 0; i < decodedData[0].length; i += 1) {
                    const aTokenContract = new web3.eth.Contract(aaveV3AToken, decodedData[4][i]);
                    const domainSeparator = await aTokenContract.methods.DOMAIN_SEPARATOR().call();
                    const permitTypeHash = await aTokenContract.methods.PERMIT_TYPEHASH().call();
                    const digest = (await web3.utils.soliditySha3(
                        { t: 'bytes', v: '0x1901' },
                        { t: 'bytes32', v: domainSeparator },
                        {
                            t: 'bytes32', v: web3.utils.soliditySha3(
                                { t: 'bytes32', v: permitTypeHash },
                                { t: 'address', v: permits[i].owner },
                                { t: 'address', v: permits[i].spender },
                                { t: 'uint256', v: permits[i].value },
                                { t: 'uint256', v: permits[i].nonce },
                                { t: 'uint256', v: permits[i].deadline }
                            )
                        })
                    );

                    const sig = web3.eth.accounts.sign(digest, options.privateKey);

                    const v = await web3.utils.toDecimal(sig.v);
                    const {r} = sig;
                    const {s} = sig;
                    
                    permitData[i] = {
                        aToken:decodedData[4][i] ,
                        value:permits[i].value,
                        deadline:permits[i].deadline,
                        v,
                        r,
                        s
                    };
                }

                const data = await Common.encodeFunctionData(web3, {
                    "functionHash": "0x3698d492",
                    "parametersType": ["address[]", "tuple[]" , "tuple[]" , "tuple[]"],
                    "parameters": [decodedData[0], [] , permitData , []]
                });

                const txObject = {
                    "from": transactionObject.from,
                    "to": transactionObject.to,
                    "value": "0",
                    "gas": transactionObject.gas,
                    "data": data
                };

                const signedTransaction = await web3.eth.accounts.signTransaction(txObject, options.privateKey);
                return (signedTransaction);

            }

        }
        catch (error) {
            return (error);
        }

    }

};
