
const { sendTransaction, signTransaction, prepareTransaction} = require('../../index');
// const baseurl = "http://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const txObject =   {
        "srcChainId":"80001",
        "bridgeId": "100",
        "srcTokenSymbol": "USDT",
        "amountIn": "10000",
        "amountOutMin":"200",
        "gas": "800000",
        "from": "0xa67e9b68c41b0f26184d64c26e0b2b81466e5994",
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
        "dstChainId": "80001" 
    };
    const rawtx = await prepareTransaction('https://uat.expand.network/bridge/swap', txObject);
    console.log(rawtx,'******');

    const privateKey = 'a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86';
    const chainId = '80001';
    const raw = await signTransaction(rawtx,{
        chainId,
        xApiKey,
        privateKey,
    });
    console.log(raw,'------>');
    raw.xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
    raw.chainId = '80001';
    const x = await sendTransaction(raw);
    console.log(x);
}
main();