const { sendTransaction, signTransaction, prepareTransaction} = require("./index");
// const baseurl = "https://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const result =  {
        lendborrowId: '1201',
        from: '0xE78d990e65d9ee62292C6975F6CE66A2C580336E',
        asset:'0x6B175474E89094C44Da98b954EedeAC495271d0F',
        amount: '10000000000000000', // erc20 token
        onBehalfOf: '0xE78d990e65d9ee62292C6975F6CE66A2C580336E',
        gas: '290000',
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
        "involveBaseToken":"1",
        "chainId":"11155111"
    };
    const rawtx = await prepareTransaction('http://localhost:3000/lendborrow/deposit', result);
    console.log(rawtx,'}}}}}}}}');
    const privateKey = '928c2233dbae403a2427ebafd46800026431015753760de29c139899210b7cae';
    const chainId = '11155111';
    const raw = await signTransaction(rawtx,{
        chainId,
        xApiKey,
        privateKey,
    });
    console.log(raw,'------>');
    raw.xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
    raw.chainId = '11155111';
    const x = await sendTransaction(raw);
    console.log(x);
}
main();