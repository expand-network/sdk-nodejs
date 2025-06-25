const { default: axios } = require("axios");
const xrpl = require('xrpl');
const schemaValidator = require('../../../configuration/schemaValidator');
const common = require('../../../configuration/common');
const config = require('../../../configuration/config.json');

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

    const account = (this.privateKey.split(" ").length > 1) ? xrpl.Wallet.fromMnemonic(this.privateKey)
    : xrpl.Wallet.fromSecret(this.privateKey);

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

module.exports = { WalletXRPL }; 