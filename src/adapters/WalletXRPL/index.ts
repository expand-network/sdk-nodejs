import axios from "axios";
import xrpl from 'xrpl';
import * as common from '../../../configuration/common';
import config from '../../../configuration/config';
import * as schemaValidator from '../../../configuration/schemaValidator';

interface WalletXRPLConstructorOptions {
  privateKey: string;
  xApiKey: string;
}

interface SignTransactionOptions {
  privateKey?: string;
  xApiKey?: string;
  chainSymbol: string;
  data: string;
  chainId?: string | number;
  function?: string;
}

interface SendTransactionOptions {
  [key: string]: any;
  function?: string;
}

class WalletXRPL {
  private privateKey: string;
  private xApiKey: string;

  constructor(options: WalletXRPLConstructorOptions) {
    this.privateKey = options.privateKey;
    this.xApiKey = options.xApiKey;
  }

  public signTransaction = async (options: SignTransactionOptions): Promise<{ chainId: string | number; rawTransaction?: string; msg?: string }> => {
    options.function = "xrplSignTransaction()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    const { chainSymbol, data } = options;
    let { chainId } = options;

    chainId = (await common.getChainId({ chainId, chainSymbol })) ?? "unknown";
    const chainName = config.chains[chainId as keyof typeof config.chains].chainName;

    if (chainName !== "XRPL") {
      return {
        chainId,
        msg: "XRPL wallet can be used only with XRP Ledger",
      };
    }

    const account = xrpl.Wallet.fromMnemonic(this.privateKey);

    const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
    const signedTx = account.sign(decodedData);

    return { chainId, rawTransaction: signedTx.tx_blob };
  };

  public sendTransaction = async (options: SendTransactionOptions): Promise<any> => {
    const filterOptions = options;
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

export { WalletXRPL };
