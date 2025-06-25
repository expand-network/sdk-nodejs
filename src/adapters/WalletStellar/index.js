const { TransactionBuilder, Keypair } = require("@stellar/stellar-sdk");
const schemaValidator = require('../../../configuration/schemaValidator');
const common = require('../../../configuration/common');
const config = require('../../../configuration/config.json');
const { default: axios } = require("axios");

class WalletStellar {
  constructor(options) {
    this.privateKey = options.privateKey,
      this.xApiKey = options.xApiKey
  }

  signTransaction = async (options) => {
    options.function = "stellarSignTransaction()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    const { chainSymbol, data } = options;
    let { chainId } = options;

    chainId = await common.getChainId({ chainId, chainSymbol });
    const chainName = config.chains[chainId]?.chainName;

    if (chainName !== "Stellar") {
      return {
        "msg": "Stellar wallet can be used only with Stellar chain"
      }
    };

    const userKeyPair = Keypair.fromSecret(this.privateKey);
    const { networkPassphrase } = config.chains[chainId];

    let rawTransaction = TransactionBuilder.fromXDR(data, networkPassphrase);
    rawTransaction.sign(userKeyPair)

    rawTransaction = rawTransaction.toEnvelope().toXDR('base64');
    return { rawTransaction, chainId };
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

module.exports = { WalletStellar }; 