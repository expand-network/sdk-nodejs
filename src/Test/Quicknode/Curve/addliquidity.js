const {  signTransaction, prepareTransaction} = require('../../../index');
const {sendTransaction} = require("expand-network");
// const { privateKey } = require('./privatekey');
const xApiKey = 'TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd';
async function main() {
    const txObject =  {
            "method": "en_addLiquidity",
            "params": [
                {
                    
                    "dexId": "1500",
                    "amountIn": [ "1000000000000000000","1000000000000000000"],
                    "path": ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"],
                    "amountOut": "0",
                    "fromInternalBalance": false,
                    "to": "0xB1Ec8FB7D9625C52264504Cd7bF53992c2F4abB7",  
                    "deadline": "1694617738234",
                    "from": "0xB1Ec8FB7D9625C52264504Cd7bF53992c2F4abB7",  
                    "gas": "230000"
                 

                  
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
    const tx = await sendTransaction({
        "chainId": "1",
        "rawTransaction":signedTx.rawTransaction,
        "xApiKey": xApiKey
    
    });
    console.log("Transaction Pending....", tx);
}
main();