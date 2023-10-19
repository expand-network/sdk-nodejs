const {  signTransaction, prepareTransaction} = require('../../../../index');
const {sendTransaction} = require("expand-network");
// const { privateKey } = require('./privatekey');
const xApiKey = 'TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd';
async function main() {
    const txObject =  {
            "method": "en_removeLiquidity",
            "params": [
                {
                    
                    "dexId": "1400",
                    "amountOut": [ "91","91"],
                    "path": ["0x6B175474E89094C44Da98b954EedeAC495271d0F","0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"],
                    "amountIn": "147692016912345470",
                    "toInternalBalance": false,
                    "to": "0xfFb4264A596751a580F046193f43064839052d6c", 
                    "from": "0xfFb4264A596751a580F046193f43064839052d6c",  
                    "gas": "230000"
                 

                  
                }
            ],
            "xApiKey": "TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd",
            "id": "test",
            "ids": "2c03e048-5778-4944-b804-0de77df9363a"
        };

    const preparedTx = await prepareTransaction('https://quicknode.expand.network/dex', txObject);
    console.log(preparedTx);
    const privateKey = '0xc985fccc2399debaf3fc53ac28301074803537cdc7ead3431fbe7f6c4fb1cec0';
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