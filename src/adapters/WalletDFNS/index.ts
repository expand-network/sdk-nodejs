import { DfnsApiClient } from "@dfns/sdk";
import { AsymmetricKeySigner } from "@dfns/sdk-keysigner";
import { DfnsWallet } from "@dfns/lib-ethersjs6";
import { JsonRpcProvider, Network, Transaction } from "ethers";
import axios from "axios";
import * as rawTransaction from "./signTransaction/index";
import config from "../../../configuration/config";
import * as common from "../../../configuration/common";
import * as schemaValidator from "../../../configuration/schemaValidator";

type WalletDFNSOptions = {
  xApiKey: string;
  privateKey: string;
  credId: string;
  appId: string;
  authToken: string;
  walletId: string;
  baseUrl: string;
  appOrigin: string;
};

type TransactionObject = {
    chainId: number;
    chainSymbol: string;
    rawTransaction: any;
    to: string; 
    value: string; 
    gas: string; 
    [key: string]: any;
};

type Options = {
    wallet: DfnsWallet;
    xApiKey: string;
    rpcProvider: JsonRpcProvider;
    privateKey?: string; 
  };

type ExtendedAsymmetricKeySignerOptions = {
    credId: string;
    privateKey: string;
    appOrigin?: string;
  };

class WalletDFNS {
  private xApiKey: string;
  private privateKey: string;
  private credId: string;
  private appId: string;
  private authToken: string;
  private walletId: string;
  private baseUrl: string;
  private appOrigin: string;
  private signer: AsymmetricKeySigner;
  private dfnsClient: DfnsApiClient;
  private wallet: DfnsWallet;

  constructor(options: WalletDFNSOptions) {
    this.xApiKey = options.xApiKey;
    this.privateKey = options.privateKey;
    this.credId = options.credId;
    this.appId = options.appId;
    this.authToken = options.authToken;
    this.walletId = options.walletId;
    this.baseUrl = options.baseUrl;
    this.appOrigin = options.appOrigin;

    this.signer = new AsymmetricKeySigner({
        privateKey: options.privateKey,
        credId: options.credId,
        appOrigin: options.appOrigin, // Include this if needed
      } as ExtendedAsymmetricKeySignerOptions);

    this.dfnsClient = new DfnsApiClient({
      appId: options.appId,
      authToken: options.authToken,
      baseUrl: options.baseUrl,
      signer: this.signer,
    });

    this.wallet = new DfnsWallet({
      walletId: this.walletId,
      dfnsClient: this.dfnsClient,
      maxRetries: 10,
    });
  }

  public signTransaction = async (transactionObject: TransactionObject): Promise<any> => {
    try {
      const transactionOptions = { ...transactionObject, function: "transactionObject()" };
      const validObject = await schemaValidator.validateInput(transactionObject);

      if (!validObject.valid) {
        return validObject;
      }

      const chainId = await common.getChainId({
        chainId: transactionObject.chainId,
        chainSymbol: transactionObject.chainSymbol,
      });

      const chainName = config.chains[chainId as keyof typeof config.chains].chainName;
      axios.defaults.headers["X-API-KEY"] = this.xApiKey;
      const apiURL = `${config.url.apiurl}/chain/getpublicrpc/`;
      const configuration = { params: { chainId } };
      let rpc:any = await axios.get(apiURL, configuration);
      rpc = rpc.data.data.rpc;

      const rpcProvider = new JsonRpcProvider(rpc, Number(transactionObject.chainId));

      if (chainName !== "Evm") {
        throw new Error("Chain not supported");
      }

      const options = {
        wallet: this.wallet,
        xApiKey: this.xApiKey,
        rpcProvider,
      };

      const response = await rawTransaction[`signTransaction${chainName}`](transactionObject, options);
      return response;
    } catch (error) {
      return error;
    }
  };

  public sendTransaction = async (transactionObject: TransactionObject): Promise<any> => {
    try {
      const filterOptions = { ...transactionObject, function: "DFNSTransaction()" };
      const validJson = await schemaValidator.validateInput(filterOptions);

      if (!validJson.valid) {
        return validJson;
      }

      axios.defaults.headers["X-API-KEY"] = this.xApiKey;
      const chainId = await common.getChainId({
        chainId: transactionObject.chainId,
        chainSymbol: transactionObject.chainSymbol,
      });

      const chainName = config.chains[chainId as keyof typeof config.chains].chainName;
      const apiURL = `${config.url.apiurl}/chain/getpublicrpc/`;
      const configuration = { params: { chainId } };
      let rpc:any = await axios.get(apiURL, configuration);
      rpc = rpc.data.data.rpc;

      if (chainName !== "Evm") {
        throw new Error("Chain not supported");
      }

      const rpcProvider = new JsonRpcProvider(rpc, Number(transactionObject.chainId));
      const wallet = this.wallet.connect(rpcProvider);
      const transaction = Transaction.from(transactionObject.rawTransaction);

      const txHash = await wallet.sendTransaction(transaction);
      return { TxHash: txHash.hash };
    } catch (error) {
      return error;
    }
  };
}

export { WalletDFNS };
