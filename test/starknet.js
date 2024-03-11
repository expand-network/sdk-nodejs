// const { Wallet } = require('../src/adapters/Wallet/index');

// const xApiKey = 'Mqjy4Wf5mZ7NlixNDAqaE2CxjNqEgdD34pueYJvc';

// const main = async () => {
//   const wallet = new Wallet({ privateKey: "0x0466ec8c85f06e6f1deafba0c4c5e558863656b60f529ed2f6a1ba6c4884c2e4", xApiKey });
//   const preparedTx = {
//     from: "0x04b1a63703beD1252807aB666a1690be1d4F7d7BF6d26381bAdb757eBBb4fBBb",
//     to: "0x0499ca53a75b5ee23fe8cc06870ab3e70b43a4cc95ddad00a1c37c4c5aa752ad",
//     value: "10000000",
//     gas: "400000",
//     chainId: '301',
//   }
//   const signedTx = await wallet.signTransaction(preparedTx);
//   console.log(signedTx);
//   // const tx = await wallet.sendTransaction(signedTx);
//   // console.log("Transaction Pending....", tx);
//   // console.log(`https://goerli.etherscan.io/tx/${tx}`);
// }

// main();


const { Wallet } = require('../src');
const xApiKey = 'TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd';
async function main() {
    const preparedTx = {
        "from": "0x0499ca53a75b5ee23fe8cc06870ab3e70b43a4cc95ddad00a1c37c4c5aa752ad",
        "to": "0x0029e382e7EFF9625fDBEf7df3Edc7B9Fc2a54629c96426cd50f9678D5Fa9635",
        "gas": "100000",
        "value": "10000",
        "chainId": "301",
        "xApiKey": xApiKey
    };
    const wallet  = new Wallet({ privateKey:'0x04c418607599986eee8be25906fbf15c884246214ae42cdb4d807ca92673fda4', xApiKey:xApiKey});
    const signedTx = await wallet.signTransaction(preparedTx);
    console.log(signedTx);
    const tx = await wallet.sendTransaction(signedTx);
    console.log(tx);
}
main();