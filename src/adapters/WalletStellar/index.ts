import axios, { AxiosRequestConfig } from "axios";
import { TransactionBuilder, Keypair } from "stellar-sdk";
import * as common from '../../../configuration/common';
import config from '../../../configuration/config';
import * as schemaValidator from '../../../configuration/schemaValidator';

interface WalletStellarOptions {
  privateKey: string;
  xApiKey: string;
}

interface SignTransactionOptions {
  function?: string;
  chainSymbol: string;
  data: string;
  chainId?: string;
}

interface SendTransactionOptions {
  function?: string;
  chainSymbol: string;
  data: string;
  chainId?: string;
}

class WalletStellar {
  private privateKey: string;
  private xApiKey: string;

  constructor(options: WalletStellarOptions) {
    this.privateKey = options.privateKey;
    this.xApiKey = options.xApiKey;
  }

  signTransaction = async (options: SignTransactionOptions) => {
    options.function = "stellarSignTransaction()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    const { chainSymbol, data } = options;
    let { chainId } = options;

    chainId = await common.getChainId({ chainId, chainSymbol }) || undefined;
    const chainName = config.chains[chainId as keyof typeof config.chains].chainName;

    if (chainName !== "Stellar") {
      return {
        msg: "Stellar wallet can be used only with Stellar chain",
      };
    }

    const userKeyPair = Keypair.fromSecret(this.privateKey);
    const networkPassphrase = config.chains[chainId as keyof typeof config.chains]?.networkPassphrase;

    if (!networkPassphrase) {
      return { msg: "Network passphrase is not defined" };
    }

    const rawTransaction = TransactionBuilder.fromXDR(data, networkPassphrase);
    rawTransaction.sign(userKeyPair);
    const xdrString = rawTransaction.toEnvelope().toXDR("base64");

    
    return { rawTransaction: xdrString, chainId  };
  };

  sendTransaction = async (options: SendTransactionOptions) => {
    const filterOptions = options;
    filterOptions.function = "sendTransaction()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return validJson;
    }

    try {
      const apiURL = `${config.url.apiurl}/chain/sendtransaction/`;
      const params: AxiosRequestConfig = {
        method: "post",
        url: apiURL,
        data: options,
        headers: {
          "x-api-key": this.xApiKey,
        },
      };

      const transactionHash = await axios(params);
      return transactionHash.data;
    } catch (error) {
      return error;
    }
  };
}

export { WalletStellar };
