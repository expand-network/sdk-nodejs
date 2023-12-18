const { WalletFordefi , prepareTransaction } = require('../../../index');
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
accessToken = 'eyJhbGciOiJFZERTQSIsImtpZCI6ImZ3MFc3aVpocUc0SUEzaXV4ZmhQIiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwczovL2FwaS5mb3JkZWZpLmNvbS8iLCJzdWIiOiI1M2ZkNzk3ZC1jMjVlLTQ1NjctYmFmZC01MmIyMzQ2ZWM3ZWNAZm9yZGVmaSIsImF1ZCI6WyJodHRwczovL2FwaS5mb3JkZWZpLmNvbS9hcGkvIl0sImV4cCI6MjAxMTMyNTc0MiwiaWF0IjoxNjk1OTY1NzQyLCJqdGkiOiIxOTA2MDYzNi1kZGY4LTQ1ZDYtYWVlNy05OWI1YTk2YjZmZWEifQ.Om0iA_KBwev7eEFzNyezCK1t_MWmAHctCkbqz8FSoWYs1HfrWvp0vtDhqn_-EcNaKeVUuPwLxTRD92ccGjEwDw';
const dotenv = require('dotenv');
async function initialiseFordefiWallet(){
    const options = { 
      accessToken: accessToken,
      xApiKey:xApiKey, 
      privateKeyFile: './private.pem',
      vault_id: 'f78b7664-0266-4452-a531-4064dfda96ee'
    } 
    const wallet  = new WalletFordefi(options);
    return wallet;
}
// ​
async function main() {
    const wallet = await initialiseFordefiWallet();
    console.log('++_+_+_+_')
    const preparedTx = await prepareTransaction("https://api.expand.network/fungibletoken/approve", {
        "from": "0x9A120137a6C66fa0e70431666B7A049ab0b5E978", 
        "tokenAddress":"0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",  
        "amount": "100000000000000",                  
        "to": "0x481A2AAE41cd34832dDCF5A79404538bb2c02bC8", 
        "gas": "100000",
        "gasPriority":"low",
        "chainId": "5",
        "xApiKey": xApiKey
    });
    preparedTx.chainId = '5';
    console.log('----==--=-=-=-==-')
    const signedTx = await wallet.signTransaction(preparedTx);
    console.log(signedTx);
    // const tx = await wallet.sendTransaction(signedTx);
    // console.log("Transaction Pending....", tx);
    // console.log(`https://goerli.etherscan.io/tx/${tx}`);
}
    
main();