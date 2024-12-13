const { default: axios } = require("axios");
const { bytesToHex } = require("@stacks/common");
const {
  TransactionSigner,
  createStacksPrivateKey,
  getPublicKey,
  publicKeyToString,
  makeUnsignedSTXTokenTransfer,
  AnchorMode,
  makeUnsignedContractCall,
  TransactionVersion,
  makeContractCall,
} = require("@stacks/transactions");
const schemaValidator = require('../../../configuration/schemaValidator');
const common = require('../../../configuration/common');
const config = require('../../../configuration/config.json');
const { StacksMainnet, StacksNetwork, StacksTestnet } = require("@stacks/network");
const { getStxAddress, generateWallet } = require("@stacks/wallet-sdk");


class WalletStacks {
  constructor(options) {
    this.privateKey = options.privateKey,
      this.xApiKey = options.xApiKey
  }

  signTransaction = async (options) => {
    options.function = "stacksSignTransaction()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    const { chainSymbol, to, value, message, data } = options;
    let { chainId } = options;

    chainId = await common.getChainId({ chainId, chainSymbol });
    const chainName = config.chains[chainId]?.chainName;

    if (chainName !== "Stacks") {
      return {
        "msg": "Stacks wallet can be used only with Stacks chain"
      }
    };

    const network = chainId === "1700" ? new StacksMainnet : new StacksTestnet();
    let transaction;
    let fee;

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
    }
    catch (error) {
      fee = '1000';
    }

    if (data) {
      // Contract Call from Stacks SDK
      transaction = JSON.parse(atob(data));
      transaction = await makeContractCall({
        ...transaction,
        fee,
        network,
        senderKey: this.privateKey,
        anchorMode: AnchorMode.Any,
      })

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

const getStacksPrivateKey = async (mnemonic, password) => {
  let wallet = await generateWallet({
    secretKey: mnemonic,
    password
  });

  const wallets = wallet.accounts.map(a => ({
    mainnetAddress: getStxAddress({ account: a, transactionVersion: TransactionVersion.Mainnet }),
    testnetAddress: getStxAddress({ account: a, transactionVersion: TransactionVersion.Testnet }),
    privateKey: a.stxPrivateKey,
  }));

  return (wallets);
}

module.exports = { WalletStacks, getStacksPrivateKey }; 