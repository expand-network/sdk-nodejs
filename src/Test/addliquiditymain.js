const { sendTransaction, signTransaction, prepareTransaction} = require('./index');
const baseurl = "https://uat.expand.network";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const txObject =   {
        "chainId": "137",
        "bridgeId": "100",
        "tokenSymbol": "USDC",
        "amountIn": "10000",
        "gas": "190000",
        "address": "0x0797736FD61be45ae5a78bDef2107DB50fC6a2Ee",
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
    };
    const rawtx = await prepareTransaction('https://uat.expand.network/bridge/addliquidity', txObject);
    console.log(rawtx,'******');

    const privateKey = '5fe1e6aa6620f849a1dcbdcc7e7ecd171c7d1793fd62620d92d4a7ce9ba69477';
    const chainId = '137';
    const raw = await signTransaction(rawtx,{
        chainId,
        xApiKey,
        privateKey,
    });
    console.log(raw,'------>');
    raw.xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
    raw.chainId = '137';
    const x = await sendTransaction(raw);
    console.log(x);
}
    
main();