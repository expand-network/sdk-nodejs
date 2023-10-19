const {  signTransaction, prepareTransaction} = require('../../../index');
const {sendTransaction} = require("expand-network");
// const { privateKey } = require('./privatekey');
const xApiKey = 'TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd';
async function main() {
    const txObject =  {
            "method": "en_swap",
            "params": [
                {
                    "dexId": "1500",
                    "path": [
                        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                        "0x853d955aCEf822Db058eb8505911ED77F175b99e"
                    ],
                    "amountIn": "100000",
                    "from": "0xB1Ec8FB7D9625C52264504Cd7bF53992c2F4abB7",
                    "to": "0xB1Ec8FB7D9625C52264504Cd7bF53992c2F4abB7",
                    "gas": "890000",
                    "maxSlippage": "5"
                  
                }
            ],
            "xApiKey": "TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd",
            "id": "test",
            "ids": "2c03e048-5778-4944-b804-0de77df9363a"
        };

    const preparedTx = await prepareTransaction('https://quicknode.expand.network/dex', txObject);
    console.log(preparedTx);
    const privateKey = '45beace71b8783b4200110e616c9af4c45cde5c44b596e08945dd5a64c1121d2';
    const chainId = '1';
    const signedTx = await signTransaction(preparedTx.result.result,{
        chainId,
        xApiKey,
        privateKey
    });
    console.log(signedTx);
    // signedTx.xApiKey = xApiKey;
    // signedTx.chainId = '5';
    const tx = await sendTransaction({
        "chainId": "1",
        "rawTransaction":signedTx.rawTransaction,
        "xApiKey": xApiKey
    
    });
    console.log("Transaction Pending....", tx);
}
main();