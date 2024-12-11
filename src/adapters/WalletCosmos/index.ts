import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import axios from "axios";
import * as schemaValidator from "../../../configuration/schemaValidator";
import * as common from "../../../configuration/common";
import * as config from "../../../configuration/config.json";

interface WalletCosmosOptions {
  privateKey: string;
  xApiKey: string;
}

interface TransactionObject {
  chainId: string;
  chainSymbol: string;
  to: string;
  value: string;
  function?: string;
}

interface SendTransactionOptions {
  [key: string]: any;
  function?: string;
}

interface ValidJsonResponse {
  valid: boolean;
  [key: string]: any;
}

class WalletCosmos {
  private wallet: string;
  private xApiKey: string;

  constructor(options: WalletCosmosOptions) {
    this.wallet = options.privateKey;
    this.xApiKey = options.xApiKey;
  }

  signTransaction = async (transactionObject: TransactionObject): Promise<any> => {
    const configuration = { params: {} };
    transactionObject.function = "txObjSol()";
    const validJson: ValidJsonResponse = await schemaValidator.validateInput(transactionObject);

    if (!validJson.valid) {
      return validJson;
    }

    const chainId = await common.getChainId({
      chainId: transactionObject.chainId,
      chainSymbol: transactionObject.chainSymbol,
    });
    const chainName = config.chains[chainId as keyof typeof config.chains].chainName;

    

    axios.defaults.headers["X-API-KEY"] = this.xApiKey;
    const apiURL = `${config.url.apiurl}/chain/getpublicrpc/`;

    configuration.params = {
      chainId,
    };

    let rpc:any = await axios.get(apiURL, configuration);
    rpc = rpc.data.data.rpc;

    if (chainName !== "Cosmos") {
      return {
        msg: "Cosmos wallet can be used only with Cosmos chains",
      };
    }

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(this.wallet, {
      prefix: "cosmos",
    });

    const account = (await wallet.getAccounts())[0].address;
    const signingClient = await SigningStargateClient.connectWithSigner(rpc, wallet);

    const tx = await signingClient.sign(
      account,
      [
        {
          typeUrl: "/cosmos.bank.v1beta1.MsgSend",
          value: {
            fromAddress: account,
            toAddress: transactionObject.to,
            amount: [{ denom: "uatom", amount: transactionObject.value }],
          },
        },
      ],
      {
        amount: [{ denom: "uatom", amount: "1000" }],
        gas: "200000",
      },
      "expand"
    );

    const encodedTx = TxRaw.encode(tx).finish();
    const rawString = Buffer.from(encodedTx).toString("base64");
    return { chainId, rawTransaction: rawString };
  };

  sendTransaction = async (options: SendTransactionOptions): Promise<any> => {
    const filterOptions = options;
    filterOptions.function = "sendTransaction()";
    const validJson: ValidJsonResponse = await schemaValidator.validateInput(options);

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

export { WalletCosmos };
