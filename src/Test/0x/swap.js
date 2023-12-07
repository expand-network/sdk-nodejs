const {  signTransaction, prepareTransaction} = require('../../index');
const {sendTransaction} = require("expand-network");
// const { privateKey } = require('./privatekey');
const xApiKey = 'TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd';
async function main() {
    const txObject =  {
        "dexId":"1600",
        "amountIn": "100000",
        "path": ["0xdAC17F958D2ee523a2206206994597C13D831ec7","0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],
        "to": "0x0a8062EeAA97b0CC055510eA125faA2cb37C1b3d",
        "from": "0x0a8062EeAA97b0CC055510eA125faA2cb37C1b3d",
        "gas": "990089",
        "gasPriority":"low",
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
            
        };

    const rawtx = await prepareTransaction('http://localhost:3000/dex/swap', txObject);
    console.log(rawtx,'******');

    // const privateKey ='0x84d9b4595762f360fe58cc49dd5466d7d61e367322070899e5a213fd66e61c62';
    // const chainId = '1';
    // const raw = await signTransaction(rawtx,{
    //     chainId,
    //     xApiKey,
    //     privateKey,
    // });
    // console.log(raw,'------>');
    // raw.xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
    // raw.chainId = '1';
    // const x = await sendTransaction(raw);
    // console.log(x);
}
    
main();
    
    
    
    
    
    
    
   