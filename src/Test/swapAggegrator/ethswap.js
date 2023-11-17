const { sendTransaction, signTransaction, prepareTransaction} = require('../../index');

// const baseurl = "http://localhost:3000";
 const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';


async function main() {
    const result =  {
        "path":["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee","0x6B175474E89094C44Da98b954EedeAC495271d0F"],
        "amountIn": "1000000000000000",
        "gas":  "900000",
        "gasPrice":"270000000000",
        "excludedDexes":["1600","1100","1300","1700"],
        "from": "0xb52340F15b7Cbd4e9178E44366c071D3849a1A0B",
        "to": "0xb52340F15b7Cbd4e9178E44366c071D3849a1A0B", 
        "chainId": "1",
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
    };
    const rawtx = await prepareTransaction('http://localhost:3000/dex/swapaggregator', result);
    console.log(rawtx,'}}}}}}}}');
    const privateKey = '0x69393f0e6639298214c6d2bec1b7ed3b559d32514547a982fd402de8a4e2e4b9';
    const chainId = '1';
    const raw = await signTransaction(rawtx.UniswapV2,{
        chainId,
        xApiKey,
        privateKey,
    });
    console.log(raw,'------>');
    raw.xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
    raw.chainId = '1';
    // console.log(raw);
    const tx = await sendTransaction({
        "chainId": "1",
        "rawTransaction":raw.rawTransaction,
        "xApiKey": xApiKey
    
    });
    console.log("Transaction Pending....", tx);
}

main();
