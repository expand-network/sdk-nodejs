const { sendTransaction, signTransaction, prepareTransaction} = require('../../index');

// const baseurl = "http://localhost:3000";
 const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';


async function main() {
    const result =  {
        "path":["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee","0x6b175474e89094c44da98b954eedeac495271d0f"],
        "amountIn": "100000000000000000",
        "gas":  "900000",
        "gasPriority":"medium",
        // "excludedDexes":["1000","1300","1100","1400"],
        "bestSwap":true,
        "from": "0x23Fc2AAc23E297605a2242fFeb19C869e4A1b520",
        "to": "0x23Fc2AAc23E297605a2242fFeb19C869e4A1b520", 
        "chainId": "1",
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
    };
    const rawtx = await prepareTransaction('http://localhost:3000/dex/swapaggregator', result);
    console.log(rawtx,'}}}}}}}}');
    const privateKey = '8c471bc03e223f0d868f3ca9889608df55d711163cce1a61e5c1ba4024d303a3';
    const chainId = '1';
    const raw = await signTransaction(rawtx.transactionPayload,{
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
