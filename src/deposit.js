const { sendTransaction, signTransaction, prepareTransaction} = require("./index");
// const baseurl = "https://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const result =  {
        lendborrowId: '1200',
        from: '0x3159E9fB0a7F5d1660F08c5e25D9aA8C011BcA27',
        asset:'0x6B175474E89094C44Da98b954EedeAC495271d0F',
        amount: '10000000000000000', // erc20 token
        onBehalfOf: '0x3159E9fB0a7F5d1660F08c5e25D9aA8C011BcA27',
        gas: '290000',
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
        "involveBaseToken":"1",
        "chainId":"1"
    };
    const rawtx = await prepareTransaction('http://localhost:3000/lendborrow/deposit', result);
    console.log(rawtx,'}}}}}}}}');
    const privateKey = '0xc7fd2e9e7cca3827acfe61bc184de514ff17e74c60fb7334ea7f0522c979587f';
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