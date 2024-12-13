const { getStacksPrivateKey } = require('../src/adapters/WalletStacks');
const { WalletStacks } = require('../src/index');
const dotenv = require('dotenv');

const main = async () => {
  dotenv.config();

  const privateKey = process.env.stacksPrivateKey;
  const recipient = "<recipient>"; 

  // Initialise the wallet client
  const wallet = new WalletStacks({ xApiKey: process.env.xApiKey, privateKey });

  const preparedTx =  {
    chainId: "1701",
    to: recipient,
    value: "3000",
    message: "Expand STACKS Test"
  }

  // Securely sign the transaction on user's end
  const signedTx = await wallet.signTransaction(preparedTx);
  console.log(signedTx)
  const tx = await wallet.sendTransaction(signedTx);

  console.log("Tx: ", tx);
}

const getWallets = async() => {
  const keys = await getStacksPrivateKey("<secret key>", "<password>");
  console.log(keys);
} 


// getWallets()

// main();



