import axios from "axios";
import * as bitcoin from "bitcoinjs-lib";
import { ECPairFactory, ECPairInterface } from "ecpair";
import * as bip39 from "bip39";
import * as tinysecp from "tiny-secp256k1";
import * as schemaValidator from "../../../configuration/schemaValidator";
import * as common from "../../../configuration/common";
import config from "../../../configuration/config";

interface WalletBitcoinOptions {
  privateKey: string;
  xApiKey: string;
}

interface TransactionOptions {
  chainSymbol?: string;
  to: string;
  value: string;
  utxo: { txId: string; vout: number; value: number };
  chainId?: string;
  [key: string]: any;
}

interface GetKeysOptions {
  chainSymbol?: string;
  mnemonic: string;
  chainId?: string;
  [key: string]: any;
}

export class WalletBitcoin {
  private privateKey: string;
  private xApiKey: string;

  constructor(options: WalletBitcoinOptions) {
    this.privateKey = options.privateKey;
    this.xApiKey = options.xApiKey;
  }

  signTransaction = async (options: TransactionOptions): Promise<any> => {
    options.function = "BTCSignTransaction()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    const { chainSymbol, to, value, utxo } = options;
    let { chainId } = options;

    chainId = await common.getChainId({ chainId, chainSymbol }) ?? "unknown";
    const chainName = config.chains[chainId as keyof typeof config.chains].chainName;

    if (chainName !== "Bitcoin") {
      return {
        msg: "Bitcoin wallet can be used only with Bitcoin Wallet",
      };
    }

    const ECPair = ECPairFactory(tinysecp);
    const network = chainId === "1800" ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;


    const privateKeyBuffer = Buffer.from(this.privateKey, "hex");
    const keyPair: ECPairInterface = ECPair.fromPrivateKey(privateKeyBuffer, { network });
    const from = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network }).address;

    const txb = new bitcoin.TransactionBuilder(network);

    txb.addInput(utxo.txId, utxo.vout);
    txb.addOutput(to, Number(value));

    const fee = config.chains[chainId].fee ?? 0;
    const actualAmount = utxo.value - Number(value) - fee;

    if (actualAmount > 0) {
      txb.addOutput(from!, actualAmount);
    }

    txb.sign(0, keyPair);
    const rawTx = txb.build().toHex();
    return { chainId, rawTransaction: rawTx };
  };

  sendTransaction = async (options: any): Promise<any> => {
    const filterOptions = { ...options, function: "sendTransaction()" };
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

export const getKeysFromMnemonic = async (
  options: GetKeysOptions,
  path: string = "m/44'/0'/0'/0/0"
): Promise<any> => {
  options.function = "BTCGetKeys()";
  const validJson = await schemaValidator.validateInput(options);

  if (!validJson.valid) {
    return validJson;
  }

  let { chainId } = options;
  const { chainSymbol, mnemonic } = options;

  chainId = await common.getChainId({ chainId, chainSymbol }) ?? "unknown";
  const chainName = config.chains[chainId as keyof typeof config.chains].chainName;

  if (chainName !== "Bitcoin") {
    return {
      msg: "Bitcoin wallet can be used only with Bitcoin Wallet",
    };
  }

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const network = chainId === "1800" ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;

  const root = bitcoin.bip32.fromSeed(seed, network);
  const child = root.derivePath(path);

  const privateKeyWIF = child.toWIF();
  const privateKeyBuffer = bitcoin.ECPair.fromWIF(privateKeyWIF, network).privateKey!;
  const privateKeyHex = privateKeyBuffer.toString("hex");
  const publickKey = child.publicKey.toString("hex");

  const { address } = bitcoin.payments.p2pkh({
    pubkey: child.publicKey,
    network,
  });

  return { privateKeyWIF, privateKeyHex, publickKey, address };
};
