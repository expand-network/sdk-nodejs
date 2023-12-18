const { WalletDFNS , prepareTransaction } = require('../../../../src/index');
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
const wallet = await initialiseDFNSWallet();    // Initialise the wallet client
// Preparing the approve transaction from expand.network
const preparedTx = await prepareTransaction('https://api.expand.network/fungibletoken/approve', {       
    "dexId": "1002",
    "tokenA": "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60", 
    "tokenB": "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C", 
    "amountADesired": "1000000000000000",
    "amountBDesired": "5707",
    "amountAMin": "0",
    "amountBMin": "0",
    "to": "0x4D62A8147c18B45D72BF02378329989533114aDf",  
    "deadline": "1702448182717",
    "from": "0x4D62A8147c18B45D72BF02378329989533114aDf",  
    "gas": "230000",
    "gasPriority":"low",
    "xApiKey": xApiKey     
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