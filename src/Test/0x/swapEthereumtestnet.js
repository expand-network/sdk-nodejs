const {  signTransaction, prepareTransaction} = require('../../index');
const {sendTransaction} = require("expand-network");
// const { privateKey } = require('./privatekey');
const xApiKey = 'TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd';
async function main() {
    const txObject =  {
        "dexId":"1601",
        "amountIn": "100000000000",
        "path": ["0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6","0xDf0360Ad8C5ccf25095Aa97ee5F2785c8d848620"],
        "to": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "from": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "gas": "990089",
        "chainId":"5",
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
            
        };

    const result = await prepareTransaction('http://localhost:3000/dex/swap', txObject);
    console.log(result);
    const privateKey = 'a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86';
    const chainId = '5';
    const signedTx = await signTransaction(result,{
        chainId,
        xApiKey,
        privateKey
    });
    console.log(signedTx);
    // signedTx.xApiKey = xApiKey;
    // signedTx.chainId = '5';
    // const tx = await sendTransaction({
    //     "chainId": "5",
    //     "rawTransaction":signedTx.rawTransaction,
    //     "xApiKey": xApiKey
    
    // });
    // console.log("Transaction Pending....", tx);
}
main();