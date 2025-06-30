const { getKeysFromMnemonic } = require('../src/adapters/WalletBitcoin');
const { WalletBitcoin } = require('../src/index');
const dotenv = require('dotenv');

const main = async () => {
  dotenv.config();

  const wallet = new WalletBitcoin({ xApiKey: process.env.xApiKey, privateKey: process.env.privateKey});

  const preparedTx = {
    chainId: "1801",
    value: "amount to send",
    to: "wallet address",
    utxo: {
      txId: "<transactionHash>", 
      vout: 0, 
      value, 
    }
  }

  // Securely sign the transaction on user's end
  const signedTx = await wallet.signTransaction(preparedTx);
  console.log(signedTx);
  const tx = await wallet.sendTransaction(signedTx);

  console.log("Tx: ", tx);
}
const getKeys = async() => {
  const keys = await getKeysFromMnemonic({ chainId: "1801", mnemonic: process.env.mnemonic});
  console.log(keys);
};

getKeys();

main();

