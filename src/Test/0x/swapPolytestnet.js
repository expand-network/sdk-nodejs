const {  signTransaction, prepareTransaction} = require('../../index');
const {sendTransaction} = require("expand-network");
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const txObject =  {
        "dexId":"1603",
        "amountIn": "10000",
        "path": ["0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7","0xfcBd6A360879728a31acEf20F3d8C41F0717C677"],
        "to": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "from": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "gas": "990089",
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
            
        };

    const result = await prepareTransaction('http://localhost:3000/dex/swap', txObject);
    console.log(result);
    const privateKey = 'a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86';
    const chainId = '80001';
    const signedTx = await signTransaction(result,{
        chainId,
        xApiKey,
        privateKey
    });
    console.log(signedTx);
    // signedTx.xApiKey = xApiKey;
    // signedTx.chainId = '5';
    const tx = await sendTransaction({
        "chainId": "80001",
        "rawTransaction":signedTx.rawTransaction,
        "xApiKey": xApiKey
    
    });
    console.log("Transaction Pending....", tx);
}
main();