

const {  signTransaction, prepareTransaction} = require('../../index');
// const {sendTransaction} = require("expand-network");
// const { privateKey } = require('./privatekey');
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const txObject =  {
        "dexId":"1000",
        "amountIn": "10000000000000000",
        "amountOutMin":"9463",
        "path": ["0x6B175474E89094C44Da98b954EedeAC495271d0F","0xdAC17F958D2ee523a2206206994597C13D831ec7"],
        "to": "0x356dB816602c85e2075774bB77D13995c8Bab023",
        "deadline": "1999036703",
        "from": "0x356dB816602c85e2075774bB77D13995c8Bab023",
        "gas": "25000",
        "gasPriority":"low",
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
            
        };

    const result = await prepareTransaction('http://localhost:3000/dex/swap', txObject);
    const privateKey = '96f965af1b75c901aea4a2f887a7b721b49834ca4f7daab1fa0047b2c57bc9a1';
    const chainId = '1';
    const signedTx = await signTransaction(result,{
        chainId,
        xApiKey,
        privateKey
    });
    console.log(signedTx);
    // signedTx.xApiKey = xApiKey;
    // signedTx.chainId = '5';
    // const tx = await sendTransaction({
    //     "chainId": "1",
    //     "rawTransaction":signedTx.rawTransaction,
    //     "xApiKey": xApiKey
    
    // });
    // console.log("Transaction Pending....", tx);
}
main();




