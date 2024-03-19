const {TransactionBuilder, Keypair} = require("stellar-sdk");
const schemaValidator = require('../../../configuration/schemaValidator');
const common = require('../../../configuration/common');
const config = require('../../../configuration/config.json');

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

    const {chainSymbol, data} = options;
    let {chainId} = options;

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
  }
}

module.exports = { WalletStellar }; 