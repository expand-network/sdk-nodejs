const { sendTransaction, signTransaction, prepareTransaction} = require('../../index');
// const baseurl = "http://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const txObject =   {
        "srcChainId": "5",
        "bridgeId": "100",
        "srcTokenSymbol": "USDC",
        "amountIn": "10000",
        "gas": "890000",
        "gasPriority":"medium",
        "from": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
    };
    const rawtx = await prepareTransaction('https://api.expand.network/bridge/addliquidity', txObject);
    console.log(rawtx,'******');

    const privateKey = 'a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86';
    const chainId = '5';
    const raw = await signTransaction(rawtx,{
        chainId,
        xApiKey,
        privateKey,
    });
    console.log(raw,'------>');
    raw.xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
    raw.chainId = '5';
    const x = await sendTransaction(raw);
    console.log(x);
}
    
main();