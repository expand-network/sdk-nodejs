const { WalletFordefi  } = require('../../../index');
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
// ​
async function main() {
// ​
 
    const preparedTx = {
        from: "kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq",
        to: "kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq",
        value: "100000",
        chainId: '901'
    }
    const accessToken = 'eyJhbGciOiJFZERTQSIsImtpZCI6ImZ3MFc3aVpocUc0SUEzaXV4ZmhQIiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwczovL2FwaS5mb3JkZWZpLmNvbS8iLCJzdWIiOiI1M2ZkNzk3ZC1jMjVlLTQ1NjctYmFmZC01MmIyMzQ2ZWM3ZWNAZm9yZGVmaSIsImF1ZCI6WyJodHRwczovL2FwaS5mb3JkZWZpLmNvbS9hcGkvIl0sImV4cCI6MjAxMTMyNTc0MiwiaWF0IjoxNjk1OTY1NzQyLCJqdGkiOiIxOTA2MDYzNi1kZGY4LTQ1ZDYtYWVlNy05OWI1YTk2YjZmZWEifQ.Om0iA_KBwev7eEFzNyezCK1t_MWmAHctCkbqz8FSoWYs1HfrWvp0vtDhqn_-EcNaKeVUuPwLxTRD92ccGjEwDw';
    const wallet  = new WalletFordefi({ accessToken:accessToken, xApiKey:xApiKey, privateKeyFile: './private.pem',vault_id: '297fac67-bf77-4391-a976-e417eb51ed2d'});
    const signedTx = await wallet.signTransaction(preparedTx);
    console.log(signedTx);
    // const tx = await wallet.sendTransaction(signedTx);
    // console.log("Transaction Pending....", tx);
    // console.log(`https://goerli.etherscan.io/tx/${tx}`);
}
    
main();