// const { getKeysFromMnemonic } = require('../src/adapters/WalletBitcoin');
const { Wallet } = require('../src/index');
const dotenv = require('dotenv');

const main = async () => {
  dotenv.config();

  const wallet = new Wallet({privateKey: "ed25519-priv-0xfd787cabc622c32cde4439cc78c4e3cb944bbbc5f5246c6f7c7f3595ccb0f039",
                             xApiKey: "tK503cR23o8YTvXhNoDNo7kQf5sQdbXP8qbqkBeQ"})

  // const preparedTx = {
  //   chainId: "1801",
  //   value: "amount to send",
  //   to: "wallet address",
  //   utxo: {
  //     txId: "<transactionHash>", 
  //     vout: 0, 
  //     value, 
  //   }
  // }
    const transactions = {
        "chainId": "1401",
        "from": "0x48662289e5162786d30e4934104a7463cab8312a96920633ea31f79abf7cbae0",
        "to": "0xdb2db1fa42691694c902e0edd3496aa6202604b31b9cf93ef1ad235171959985",
        "data":'eyJmdW5jdGlvbiI6IjB4MTo6YXB0b3NfYWNjb3VudDo6dHJhbnNmZXIiLCJmdW5jdGlvbkFyZ3VtZW50cyI6WyIweGRiMmRiMWZhNDI2OTE2OTRjOTAyZTBlZGQzNDk2YWE2MjAyNjA0YjMxYjljZjkzZWYxYWQyMzUxNzE5NTk5ODUiLDEwXSwiYXJndW1lbnRzVHlwZXMiOlsiYWRkcmVzcyIsInU2NCJdfQ==',
    }
  // Securely sign the transaction on user's end
  const signedTx = await wallet.signTransaction(transactions);
  console.log(signedTx);
  const tx = await wallet.sendTransaction(signedTx);

  console.log("Tx: ", tx);
}
// const getKeys = async() => {
//   const keys = await getKeysFromMnemonic({ chainId: "1801", mnemonic: process.env.mnemonic});
//   console.log(keys);
// };

// getKeys();

main();

