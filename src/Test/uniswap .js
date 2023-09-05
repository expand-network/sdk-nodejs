
const { sendTransaction, signTransaction, prepareTransaction} = require('../index');
// const baseurl = "https://uat.expand.network";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const txObject =   {
            "method": "en_swap",
    "params": [
        {
            "path": [
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "0xdac17f958d2ee523a2206206994597c13d831ec7"
            ],
            "amountIn": "100000000000000000",
            "from":"0xa67E9B68c41b0f26184D64C260b2B81466E5994",
            "to":  "0xa67E9B68c41b0f26184D64C260b2B81466E5994",
            "gas": "32900",
            "maxSlippage":"5",
            "bestSwap":"true",
            "xApikey":"vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
            
        }
    ]
    };
    const rawtx = await prepareTransaction('https://quicknode.expand.network/dex', txObject);
    console.log(rawtx,'******');
    const privateKey = 'a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86';
    const chainId = '1';
    const raw = await signTransaction(rawtx,{
        chainId,
        xApiKey,
        privateKey,
    });
    console.log(raw,'------>');
    raw.xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
    raw.chainId = '1';
    const x = await sendTransaction(raw);
    console.log(x);
}

main();
