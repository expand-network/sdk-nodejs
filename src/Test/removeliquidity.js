const { sendTransaction, signTransaction, prepareTransaction} = require('./index');
const baseurl = "https://uat.expand.network";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const txObject =   {
        "chainId": "5",
        "bridgeId": "100",
        "tokenSymbol": "USDT",
        "amountOut": "10000",
        "gas": "100000",
        "address": "0xa67e9b68c41b0f26184d64c26e0b2b81466e5994",
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
    };

    const rawtx = await prepareTransaction('https://uat.expand.network/bridge/removeliquidity', txObject);
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