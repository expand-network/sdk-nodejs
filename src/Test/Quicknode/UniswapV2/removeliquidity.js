const {  signTransaction, prepareTransaction} = require('../../../index');
const {sendTransaction} = require("expand-network");
// const { privateKey } = require('./privatekey');
const xApiKey = 'TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd';
async function main() {
    const txObject =  {
            "method": "en_removeLiquidity",
            "params": [
                {
                    
                    "dexId": "1000",
                    "tokenA": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", 
                    "tokenB": "0x6B175474E89094C44Da98b954EedeAC495271d0F", 
                    "amountAMin": "0",
                    "amountBMin": "0",
                    "liquidity":"132012409893664260",
                    "to": "0xAEdf46101CD0D175bEE94082c094a9319A0634e4",  
                    "deadline": "1697105760392",
                    "from": "0xAEdf46101CD0D175bEE94082c094a9319A0634e4",  
                    "gas": "930000"
                 

                  
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
    const tx = await sendTransaction({
        "chainId": "1",
        "rawTransaction":signedTx.rawTransaction,
        "xApiKey": xApiKey
    
    });
    console.log("Transaction Pending....", tx);
}
main();