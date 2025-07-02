import dotenv from 'dotenv';
import { WalletDFNS } from '../src/index'; 

dotenv.config();


interface PreparedTransaction {
  from: string;
  to: string;
  value: string;
  gas: string;
  chainId: string;
  xApiKey: string;
}

async function main(): Promise<void> {
  const {
    DFNS_PRIVATE_KEY,
    DFNS_CRED_ID,
    xApiKey,
    DFNS_APP_ID,
    DFNS_ACCESS_TOKEN,
    DFNS_API_URL,
    WALLET_ID,
  } = process.env;

  if (
    !DFNS_PRIVATE_KEY ||
    !DFNS_CRED_ID ||
    !xApiKey ||
    !DFNS_APP_ID ||
    !DFNS_ACCESS_TOKEN ||
    !DFNS_API_URL ||
    !WALLET_ID
  ) {
    console.error('Missing required environment variables.');
    return;
  }

  const preparedTx: PreparedTransaction = {
    from: 'FROM_WALLET_ADDRESS',        
    value: '1000000',
    to: 'TO_WALLET_ADDRESS',           
    gas: '100000',
    chainId: '5',
    xApiKey,
  };

  
  const options = {
    privateKey: DFNS_PRIVATE_KEY,
    credId: DFNS_CRED_ID,
    xApiKey,
    appId: DFNS_APP_ID,
    authToken: DFNS_ACCESS_TOKEN,
    baseUrl: DFNS_API_URL,
    walletId: WALLET_ID,
    appOrigin: 'http://localhost:3000',
  };

  try {
    const wallet = new WalletDFNS(options);
    const signedTx = await wallet.signTransaction(preparedTx);
    const tx = await wallet.sendTransaction(signedTx);
    console.log('Transaction Pending....', tx);
  } catch (error) {
    console.error('Transaction Error:', error);
  }
}

main();
