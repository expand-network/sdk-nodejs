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
    const preparedTx = await prepareTransaction("https://api.expand.network/dex/addliquidity", {
        
    "dexId": "1002",
    "tokenA": "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60", 
    "tokenB": "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C", 
    "amountADesired": "1000000000000000",
    "amountBDesired": "5707",
    "amountAMin": "0",
    "amountBMin": "0",
    "to": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",  
    "deadline": "1702383020596",
    "from": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",  
    "gas": "230000",
    "gasPriority":"low",
    "xApiKey": xApiKey
    });
    preparedTx.chainId = '5';
    const signedTx = await wallet.signTransaction(preparedTx);
    console.log(signedTx);
    const tx = await wallet.sendTransaction(signedTx);
    console.log("Transaction Pending....", tx);
    // console.log(`https://goerli.etherscan.io/tx/${tx}`);
}
    
main();