const {  signTransaction, prepareTransaction} = require('../../../index');
const {sendTransaction} = require("expand-network");
// const { privateKey } = require('./privatekey');
const xApiKey = 'TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd';
async function main() {
    const txObject =  {
            "method": "en_removeLiquidity",
            "params": [
                {
                    
                    "dexId": "1102",
                    "tokenA": "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", 
                    "tokenB": "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844", 
                    "amountAMin": "0",
                    "amountBMin": "0",
                    "liquidity":"282333374225136",
                    "to": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",  
                    "deadline": "1694596802229",
                    "from": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",  
                    "gas": "230000"
                 

                  
                }
            ],
            "xApiKey": "TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd",
            "id": "test",
            "ids": "2c03e048-5778-4944-b804-0de77df9363a"
        };

    const preparedTx = await prepareTransaction('https://quicknode.expand.network/dex', txObject);
    console.log(preparedTx);
    const privateKey = 'a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86';
    const chainId = '5';
    const signedTx = await signTransaction(preparedTx.result.result,{
        chainId,
        xApiKey,
        privateKey
    });
    console.log(signedTx);
    const tx = await sendTransaction({
        "chainId": "5",
        "rawTransaction":signedTx.rawTransaction,
        "xApiKey": xApiKey
    
    });
    console.log("Transaction Pending....", tx);
}
main();