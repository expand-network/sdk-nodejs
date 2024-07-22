const { WalletStellar, prepareTransaction } = require('../src/index');
const dotenv = require('dotenv');

const main = async () => {
  // configure the env
  dotenv.config();

  // Initialise the wallet client
  const wallet = new WalletStellar({ xApiKey: process.env.xApiKey, privateKey: process.env.privateKey });

  // Prepare the transaction from expand api
  const preparedTx = await prepareTransaction('http://localhost:3000/rwa/issue', {
    "chainId": "1501",
    "issuer": "<Issuer>",
    "assetCode": "<ExpandDollar>",
    "amount": "50",
    "to": "<Distributor>",
    "xApiKey": process.env.xApiKey
  });

  // Securely sign the transaction on user's end
  const signedTx = await wallet.signTransaction(preparedTx);
  const tx = await wallet.sendTransaction(signedTx);

  console.log("Tx: ", tx);
}

main();

