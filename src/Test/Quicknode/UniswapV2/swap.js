const {  signTransaction, prepareTransaction} = require('../../../index');
const {sendTransaction} = require("expand-network");
// const { privateKey } = require('./privatekey');
const xApiKey = 'TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd';
async function main() {
    const txObject =  {
            "method": "en_swap",
            "params": [
                {
                    "dexId": "1000",
                    "path": [
                        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                        "0x6B175474E89094C44Da98b954EedeAC495271d0F"
                    ],
                    "amountIn": "10000000000000000",
                    "from": "0xAEdf46101CD0D175bEE94082c094a9319A0634e4",
                    "to": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
                    "gas": "990000",
                    "maxSlippage": "2"
                  
                }
            ],
            "xApiKey": "TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd",
            "id": "test",
            "ids": "2c03e048-5778-4944-b804-0de77df9363a"
        };

    const preparedTx = await prepareTransaction('https://quicknode.expand.network/dex', txObject);
    console.log(preparedTx);
    const privateKey = '8431c85c196aeeb649b953829975aff94ae0a6fb2d1f918341023e4d591f0249';
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