const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const { SigningStargateClient } = require("@cosmjs/stargate");
const { TxRaw } = require("cosmjs-types/cosmos/tx/v1beta1/tx");
const axios = require('axios').default;
const common = require('../../../configuration/common');
const config = require('../../../configuration/config.json');
const schemaValidator = require('../../../configuration/schemaValidator');


class WalletCosmos {

    constructor(options) {
        this.wallet = options.privateKey;
        this.xApiKey = options.xApiKey;
    }

    signTransaction = async (transactionObject) => {

        const configuration = { "params": {} };
        transactionObject.function = "txObjSol()";
        const validJson = await schemaValidator.validateInput(transactionObject);

        if (!validJson.valid) {
            return validJson;
        }

        const chainId = await common.getChainId({ chainId: transactionObject.chainId, chainSymbol: transactionObject.chainSymbol });
        let chainName = config.chains[chainId].chainName;

        axios.defaults.headers['X-API-KEY'] = this.xApiKey;
        const apiURL = `${config.url.apiurl}/chain/getpublicrpc/`;

        configuration.params = {
            chainId
        };

        let rpc = await axios.get(apiURL, configuration);
        rpc = rpc.data.data.rpc;

        if (chainName !== "Cosmos") {
            return {
                "msg": "Cosmos wallet can be used only with Cosmos chains"
            };
        };

        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(this.wallet, {
            prefix: "cosmos",
        });

        const Account = (await wallet.getAccounts())[0].address;
        const signingClient = await SigningStargateClient.connectWithSigner(rpc, wallet);

        const tx = await signingClient.sign(Account, [
            {
                typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                value: {
                  fromAddress: Account,
                  toAddress: transactionObject.to,
                  amount: [{ denom: "uatom", amount: transactionObject.value }],
                },
              }
          ], {
            amount: [{ denom: "uatom", amount: "1000" }],
            gas: "200000",
         },
         "expand"
        );

        const encodedTx = TxRaw.encode(tx).finish();
        const rawString = Buffer.from(encodedTx).toString("base64");
        return { chainId: chainId, rawTransaction: rawString };

    };

    sendTransaction = async (options) => {

        const filterOptions = options;
        filterOptions.function = "sendTransaction()";
        const validJson = await schemaValidator.validateInput(options);
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

module.exports = { WalletCosmos }; 