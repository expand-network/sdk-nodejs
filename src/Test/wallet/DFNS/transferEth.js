const { WalletDFNS , prepareTransaction } = require('../../../index');
const dotenv = require('dotenv');
dotenv.config({path:'../../../../.env'});
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function initialiseDFNSWallet(){
    const options = {};
    options.privateKey = process.env.DFNS_PRIVATE_KEY;
    options.credId = process.env.DFNS_CRED_ID;
    options.xApiKey = xApiKey;
    options.appId = process.env.DFNS_APP_ID;
    options.authToken = process.env.DFNS_ACCESS_TOKEN;
    options.baseUrl = process.env.DFNS_API_URL;
    options.walletId = process.env.WALLET_ID;
    options.appOrigin = 'http://localhost:3000';
    const wallet  = await new WalletDFNS(options);
    return wallet;
}
async function main() {
const wallet = await initialiseDFNSWallet(); 
   // Initialise the wallet client
// Preparing the approve transaction from expand.network
const preparedTx = await prepareTransaction('https://api.expand.network/fungibletoken/transfer', {       
    "from": "0x4D62A8147c18B45D72BF02378329989533114aDf",
    "tokenAddress": "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
    "to": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
    "amount": "10000000",
    "gas": "960000",
    "gasPriority":"medium",
    "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"     
    });
   preparedTx.chainId = '5'; 
   console.log(preparedTx);

// // Sign the transaction locally using sdk client
const SignedTx = await wallet.signTransaction(preparedTx);         
SignedTx.chainId = '5';  // Replace with other chainId to toggle between chains

// Send the signed transaction
// console.log('[][][][][][][]')
let txHash = await wallet.sendTransaction(SignedTx);    
console.log(txHash);     
// console.log(` transaction: https://etherscan.io/tx/${txHash.TxHash}`);  // Confirmation
}
main();