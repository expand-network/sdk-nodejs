import { bytesToHex } from "@stacks/common";
import { StacksMainnet, StacksTestnet, StacksNetwork } from "@stacks/network";
import {
  TransactionSigner,
  createStacksPrivateKey,
  getPublicKey,
  publicKeyToString,
  makeUnsignedSTXTokenTransfer,
  AnchorMode,
  makeContractCall,
  StacksTransaction,
  TransactionVersion, 
} from "@stacks/transactions";
import { getStxAddress, generateWallet } from "@stacks/wallet-sdk";
import axios from "axios";
import * as common from '../../../configuration/common';
import config from '../../../configuration/config';
import * as schemaValidator from '../../../configuration/schemaValidator';

interface WalletOptions {
  privateKey: string;
  xApiKey: string;
}

interface TransactionOptions {
  chainSymbol: string;
  to: string;
  value: string;
  message?: string;
  data?: string;
  chainId?: string;
}


interface SendTransactionOptions {
  [key: string]: any;
}

class WalletStacks {
  private privateKey: string;
  private xApiKey: string;

  constructor(options: WalletOptions) {
    this.privateKey = options.privateKey;
    this.xApiKey = options.xApiKey;
  }

  signTransaction = async (options: any): Promise<any> => {
    options.function = "stacksSignTransaction()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    const { chainSymbol, to, value, message, data } = options;
    let { chainId } = options;

    chainId = await common.getChainId({ chainId, chainSymbol }) ?? "unknown";
    const chainName = config.chains[chainId as keyof typeof config.chains].chainName;

    if (chainName !== "Stacks") {
      return {
        msg: "Stacks wallet can be used only with Stacks chain"
      };
    }

    const network: StacksNetwork = chainId === "1700" ? new StacksMainnet() : new StacksTestnet();
    let transaction: StacksTransaction;
    let fee: string;

    try {
      const apiURL = `${config.url.apiurl}/chain/getgasprice/`;
      const params = {
        method: "post",
        url: apiURL,
        data: options,
        headers: {
          "x-api-key": this.xApiKey
        }
      };
      const res = await axios(params);
      fee = res.data.gasPrice;
    } catch (error) {
      fee = '1000';
    }

    if (data) {
      // Contract Call from Stacks SDK
      const parsedData = JSON.parse(atob(data));
      transaction = await makeContractCall({
        ...parsedData,
        fee,
        network,
        senderKey: this.privateKey,
        anchorMode: AnchorMode.Any,
      });
    } else {
      // Transfer token function from Stacks SDK
      const privateKeyBuffer = createStacksPrivateKey(this.privateKey);
      const publicKeyBuffer = getPublicKey(privateKeyBuffer);
      const publicKey = publicKeyToString(publicKeyBuffer);
      transaction = await makeUnsignedSTXTokenTransfer({
        network,
        recipient: to,
        amount: value,
        fee,
        memo: message || "through expand",
        publicKey: publicKey,
        anchorMode: AnchorMode.Any,
      });
    }

    const signer = new TransactionSigner(transaction);
    signer.signOrigin(createStacksPrivateKey(this.privateKey));

    // Serialize the signed transaction
    const serializedTx = transaction.serialize();
    const rawTransaction = bytesToHex(serializedTx);

    return { chainId, rawTransaction };
  };

  sendTransaction = async (options: SendTransactionOptions): Promise<any> => {
    const filterOptions = { ...options };
    filterOptions.function = "sendTransaction()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return validJson;
    }

    try {
      const apiURL = `${config.url.apiurl}/chain/sendtransaction/`;
      const params = {
        method: "post",
        url: apiURL,
        data: options,
        headers: {
          "x-api-key": this.xApiKey
        }
      };

      const transactionHash = await axios(params);
      return transactionHash.data;
    } catch (error) {
      return error;
    }
  };
}

const getStacksPrivateKey = async (mnemonic: string, password: string) => {
  const wallet = await generateWallet({
    secretKey: mnemonic,
    password
  });

  const wallets = wallet.accounts.map(account => ({
    mainnetAddress: getStxAddress({
      account,
      transactionVersion: TransactionVersion.Mainnet
    }),
    testnetAddress: getStxAddress({
      account,
      transactionVersion: TransactionVersion.Testnet
    }),
    privateKey: account.stxPrivateKey,
  }));

  return wallets;
};

export { WalletStacks, getStacksPrivateKey };