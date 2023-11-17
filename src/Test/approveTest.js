const { sendTransaction, signTransaction, prepareTransaction} = require('../index');

// const baseurl = "http://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';


async function main() {
    const result =  {
        from: '0x356dB816602c85e2075774bB77D13995c8Bab023',
        tokenAddress:'0x6B175474E89094C44Da98b954EedeAC495271d0F',
        amount: '1000000000000000000', // erc20 token
        to: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
        gas: '20000',
        gasPriority: 'low',
        chainId: '1',
        xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
    };
    const rawtx = await prepareTransaction('https://api.expand.network/fungibletoken/approve', result);
    console.log(rawtx,'}}}}}}}}');
    const privateKey = '96f965af1b75c901aea4a2f887a7b721b49834ca4f7daab1fa0047b2c57bc9a1';
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
