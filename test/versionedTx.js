const { WalletPhantom, prepareTransaction, } = require('../src');

const xApiKey = 'X_API_KEY';

async function main() {
    const preparedTx = await prepareTransaction('http://localhost:3000/dex/swap', {
        "dexId": "2600",
        "from": "PUBLICKKEY",
        "amountIn": "10000000",
        "path": [
            "So11111111111111111111111111111111111111112",
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        ],
        "xApiKey": xApiKey
    });
    
    const wallet  = new WalletPhantom({ privateKey:'PRIVATEKEY', xApiKey:xApiKey});
    const signedTx = await wallet.signVersionedTransaction(preparedTx);
    console.log(signedTx);
    const TxHash = await wallet.sendTransaction(signedTx);
    console.log(TxHash);
}
    
main();