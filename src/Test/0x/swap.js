const {  signTransaction, prepareTransaction} = require('../../index');
const {sendTransaction} = require("expand-network");
// const { privateKey } = require('./privatekey');
const xApiKey = 'TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd';
async function main() {
    const txObject =  {
        "dexId":"1600",
        "amountIn": "1000000000000000000",
        "path": ["0x6B175474E89094C44Da98b954EedeAC495271d0F","0xdAC17F958D2ee523a2206206994597C13D831ec7"],
        "to": "0x6AFb0df2F5ab5012568991549544dbC44Dfb6483",
        "deadline": "1999036703",
        "from": "0x6AFb0df2F5ab5012568991549544dbC44Dfb6483",
        "gas": "990089",
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
            
        };

    const result = await prepareTransaction('http://localhost:3000/dex/swap', txObject);
    console.log(result);
    const privateKey = 'c2615f872d3a77ab320d1ad7304a83cea334b54a136ae9a2b8d6e798e7984c19';
    const chainId = '1';
    const signedTx = await signTransaction(result,{
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