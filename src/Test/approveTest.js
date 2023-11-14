const { sendTransaction, signTransaction, prepareTransaction} = require('../index');

// const baseurl = "http://localhost:3000";
const xApiKey = 'Mqjy4Wf5mZ7NlixNDAqaE2CxjNqEgdD34pueYJvc';


async function main() {
    const result =  {
        from: '0x356dB816602c85e2075774bB77D13995c8Bab023',
        tokenAddress:'0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        amount: '100000', // erc20 token
        to: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        gas: '900000',
        chainId: '1',
        xApiKey: "Mqjy4Wf5mZ7NlixNDAqaE2CxjNqEgdD34pueYJvc",
    };
    const rawtx = await prepareTransaction('https://uat.expand.network/fungibletoken/approve', result);
    console.log(rawtx,'}}}}}}}}');
    const privateKey = '96f965af1b75c901aea4a2f887a7b721b49834ca4f7daab1fa0047b2c57bc9a1';
    const chainId = '1';
    const raw = await signTransaction(rawtx,{
        chainId,
        xApiKey,
        privateKey,
    });
    console.log(raw,'------>');
    raw.xApiKey = 'Mqjy4Wf5mZ7NlixNDAqaE2CxjNqEgdD34pueYJvc';
    raw.chainId = '1';
    const x = await sendTransaction(raw);
    console.log(x);
}

main();
