const { default: axios } = require("axios");
const bitcoin = require('bitcoinjs-lib');
const { ECPairFactory } = require('ecpair');
const bip39 = require('bip39');

const tinysecp = require('tiny-secp256k1');
const schemaValidator = require('../../../configuration/schemaValidator');
const common = require('../../../configuration/common');
const config = require('../../../configuration/config.json');

class WalletBitcoin {
  constructor(options) {
    this.privateKey = options.privateKey,
      this.xApiKey = options.xApiKey
  }

  signTransaction = async (options) => {
    options.function = "BTCSignTransaction()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    const { chainSymbol, to, value, utxo } = options;
    let { chainId } = options;

    chainId = await common.getChainId({ chainId, chainSymbol });
    const chainName = config.chains[chainId]?.chainName;

    if (chainName !== "Bitcoin") {
      return {
        "msg": "Bitcoin wallet can be used only with Bitcoin Wallet"
      }
    };

    const ECPair = ECPairFactory(tinysecp);
    const network = chainId === "1800" ? bitcoin.networks.mainnet : bitcoin.networks.testnet; 

    const privateKeyBuffer = Buffer.from(this.privateKey, 'hex');
    const keyPair = ECPair.fromPrivateKey(privateKeyBuffer, { network });
    const from = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network }).address;

    const txb = new bitcoin.TransactionBuilder(network);

    // To Do: get all the UTXOs
    txb.addInput(utxo.txId, utxo.vout);
    txb.addOutput(to, Number(value));

    const fee = config.chains[chainId].fee;
    const actualAmount = utxo.value - Number(value) - fee;

    if (actualAmount > 0) {
      txb.addOutput(from, actualAmount);
    }

    txb.sign(0, keyPair);
    const rawTx = txb.build().toHex();
    return { chainId, rawTransaction: rawTx };
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
};

const getKeysFromMnemonic = async (options, path = "m/44'/0'/0'/0/0") => {
  options.function = "BTCGetKeys()";
  const validJson = await schemaValidator.validateInput(options);

  if (!validJson.valid) {
    return validJson;
  }

  let { chainId } = options;
  const { chainSymbol, mnemonic } = options;

  chainId = await common.getChainId({ chainId, chainSymbol });
  const chainName = config.chains[chainId]?.chainName;

  if (chainName !== "Bitcoin") {
    return {
      "msg": "Bitcoin wallet can be used only with Bitcoin Wallet"
    }
  };

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const network = chainId === "1800" ? bitcoin.networks.mainnet : bitcoin.networks.testnet;

  // Create an HD wallet from the seed
  const root = bitcoin.bip32.fromSeed(seed, network);

  // Derive the key at the specified path
  const child = root.derivePath(path);

  // Get the private key in WIF (Wallet Import Format)
  const privateKeyWIF = child.toWIF();

  // Decode WIF to get the actual private key in hexadecimal
  const privateKeyBuffer = bitcoin.ECPair.fromWIF(child.toWIF(), network).privateKey;
  const privateKeyHex = privateKeyBuffer.toString('hex');

  // Get the public Key
  const publickKey = child.publicKey.toString('hex');

  // Get the public address (Pay to pubkey hash)
  const { address } = bitcoin.payments.p2pkh({
    pubkey: child.publicKey,
    network: network
  });

  return { privateKeyWIF, privateKeyHex, publickKey, address };
}

module.exports = { WalletBitcoin, getKeysFromMnemonic }; 
