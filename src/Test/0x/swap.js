const {  signTransaction, prepareTransaction} = require('../../index');
const {sendTransaction} = require("expand-network");
// const { privateKey } = require('./privatekey');
const xApiKey = 'TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd';
async function main() {
    const txObject =  {
        "dexId":"1600",
        "amountIn": "100000",
        "path": ["0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7","0xfcBd6A360879728a31acEf20F3d8C41F0717C677"],
        "to": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "deadline": "1999036703",
        "from": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "gas": "990089"
            
        };

    const preparedTx = await prepareTransaction('http://localhost:3000/dex/swap', txObject);
    console.log(preparedTx);
    const privateKey = '0xc985fccc2399debaf3fc53ac28301074803537cdc7ead3431fbe7f6c4fb1cec0';
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