import { config } from 'dotenv';
import { getKeysFromMnemonic } from '../src/adapters/WalletBitcoin';
import { WalletBitcoin } from '../src/index';


config();


interface UTXO {
  txId: string;
  vout: number;
  value: any;
}

interface PreparedTransaction {
  chainId: string;
  value: string;
  to: string;
  utxo: UTXO;
}

const main = async () => {
  const xApiKey = process.env.xApiKey;
  const privateKey = process.env.privateKey;

  if (!xApiKey || !privateKey) {
    console.error('Missing xApiKey or privateKey in .env');
    return;
  }

  const wallet = new WalletBitcoin({
    xApiKey,
    privateKey,
  });

  const value = "amount to send"; 
  const preparedTx: PreparedTransaction = {
    chainId: "1801",
    value,
    to: "wallet address", 
    utxo: {
      txId: "<transactionHash>", 
      vout: 0,
      value,
    },
  };

  try {
    const signedTx = await wallet.signTransaction(preparedTx);
    console.log('Signed Tx:', signedTx);

    const tx = await wallet.sendTransaction(signedTx);
    console.log('Tx:', tx);
  } catch (error) {
    console.error('Transaction error:', error);
  }
};

const getKeys = async () => {
  const mnemonic = process.env.mnemonic;

  if (!mnemonic) {
    console.error('Mnemonic not found in .env');
    return;
  }

  try {
    const keys = await getKeysFromMnemonic({
      chainId: "1801",
      mnemonic,
    });

    console.log('Keys:', keys);
  } catch (error) {
    console.error('Key derivation error:', error);
  }
};

getKeys();
main();
