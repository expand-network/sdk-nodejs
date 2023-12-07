const { sendTransaction, signTransaction, prepareTransaction} = require('../index');

// const baseurl = "http://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';


async function main() {
    const result =  {
        from: '0xa67E9B68c41b0f26184D64C26e0b2B81466E5994',
        tokenAddress:"0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb",
        amount: '10000000', // erc20 token
        to: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
        gas: '400000',
        gasPriority:"low",
        chainId: '5',
        xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
    };
    const rawtx = await prepareTransaction('http://localhost:3000/fungibletoken/approve', result);
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
