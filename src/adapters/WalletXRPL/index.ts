import  axios from "axios";
import xrpl from 'xrpl';
import * as schemaValidator from '../../../configuration/schemaValidator';
import * as common from '../../../configuration/common';
import * as config from '../../../configuration/config.json';

class WalletXRPL {
  constructor(options) {
    this.privateKey = options.privateKey,
      this.xApiKey = options.xApiKey
  }

  signTransaction = async (options) => {
    options.function = "xrplSignTransaction()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    const { chainSymbol, data } = options;
    let { chainId } = options;

    chainId = await common.getChainId({ chainId, chainSymbol });
    const chainName = config.chains[chainId]?.chainName;

    if (chainName !== "XRPL") {
      return {
        "msg": "XRPL wallet can be used only with XRP Ledger"
      }
    };

    const account = xrpl.Wallet.fromMnemonic(this.privateKey);

    const decodedData = JSON.parse(atob(data));
    const signedTx = account.sign(decodedData);

    return { chainId, rawTransaction: signedTx.tx_blob };
  };

  sendTransaction = async (options) => {
    const filterOptions = options;
    filterOptions.function = "sendTransaction()";
    const validJson = await schemaValidator.validateInput(filterOptions);
    
    if (!validJson.valid) {
      return (validJson);
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
    }

    catch (error) {
      return error;
    }
  };
}

export { WalletXRPL }; 