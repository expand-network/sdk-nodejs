const { sendTransaction, signTransaction, prepareTransaction} = require('../../index');

// const baseurl = "http://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';


async function main() {
    const result =  {
    "dexId":"1000",
    "amountIn": "10000000000000",
    "amountOutMin": "0",
    "path": ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","0x6B175474E89094C44Da98b954EedeAC495271d0F"],
    "to": "0x22cf65ae3fa16d6379e72f4b4c2401c1b7c69731",
    "deadline": "1701931771",
    "from": "0x22cf65ae3fa16d6379e72f4b4c2401c1b7c69731",
    "gas": "173376",
    "gasPriority":"low",
    "slippage":"10",
    "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
    };
    const rawtx = await prepareTransaction('http://localhost:3000/dex/swap', result);
    const privateKey = '0x845854021b2afd660a76f17df22e4591c820b4478fbc088ddf96b350bdedcbe3';
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
