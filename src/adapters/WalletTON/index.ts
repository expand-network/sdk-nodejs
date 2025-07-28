import { WalletContractV4, internal, Cell } from "@ton/ton";
import { mnemonicToPrivateKey, keyPairFromSecretKey } from "ton-crypto";
import * as common from '../../../configuration/common';
import config from '../../../configuration/config';
import { initialiseWeb3 } from "../../../configuration/intialiseWeb3";
import * as schemaValidator from '../../../configuration/schemaValidator';

interface WalletTONOptions {
    privateKey: string;
    xApiKey: string;
}

interface TransactionObject {
    function?: string;
    chainId: string;
    chainSymbol?: string;
    to: string;
    value: string;
    message?: string;
    rawTransaction?: any;
}

class WalletTON {
    private privateKey: Buffer;
    private keyPair: { publicKey: Uint8Array; secretKey: Uint8Array };
    private xApiKey: string;
    private wallet: WalletContractV4;
    private _nanotons = 10 ** 9;

    constructor(options: WalletTONOptions) {
        this.privateKey = Buffer.from(options.privateKey, 'hex');
        this.keyPair = keyPairFromSecretKey(this.privateKey);
        this.xApiKey = options.xApiKey;

        this.wallet = WalletContractV4.create({
            publicKey: Buffer.from(this.keyPair.publicKey), 
            workchain: 0
        });
    }

    static async getPrivateKey(mnemonic: string): Promise<string> {
        const arr = mnemonic.split(" ");
        const keyPair = await mnemonicToPrivateKey(arr);
        const privateKey = Buffer.from(keyPair.secretKey).toString('hex');
        return privateKey;
    }

    async signTransaction(transactionObject: TransactionObject): Promise<any> {
        const configuration = { params: {} };
        transactionObject.function = "tonTxObject()";
        const validJson = await schemaValidator.validateInput(transactionObject);

        if (!validJson.valid) {
            return validJson;
        }

        const chainId = await common.getChainId({
            chainId: transactionObject.chainId,
            chainSymbol: transactionObject.chainSymbol
        });
        const chainName = config.chains[chainId as keyof typeof config.chains].chainName;

        if (chainName !== "TON") {
            return {
                msg: "ton wallet can be used only with TON chain"
            };
        }

        const web3 = await initialiseWeb3({ chainId, key: this.xApiKey });
        const walletContract = web3.open(this.wallet);

        let body;
        try {
            body = Cell.fromBase64(transactionObject?.message || "through expand");
        } catch (error) {
            body = transactionObject.message || "through expand"; // Optional comment
        }

        const seqno = await walletContract.getSeqno();
        const rawData = await walletContract.createTransfer({
            secretKey: this.privateKey,
            seqno,
            messages: [
                internal({
                    to: transactionObject.to,
                    value: BigInt(transactionObject.value) / BigInt(this._nanotons), // Convert to bigint
                    body,
                    bounce: false
                })
            ]
        });

        return { rawTransaction: rawData, chainId };
    }

    async sendTransaction(transactionObject: TransactionObject): Promise<any> {
        transactionObject.function = "TONTransaction()";
        const validJson = await schemaValidator.validateInput(transactionObject);
        if (!validJson.valid) {
            return validJson;
        }

        try {
            const chainId = await common.getChainId({
                chainId: transactionObject.chainId,
                chainSymbol: transactionObject.chainSymbol
            });
            const chainName = config.chains[chainId as keyof typeof config.chains].chainName;
            const web3 = await initialiseWeb3({ chainId, key: this.xApiKey });

            if (chainName !== "TON") {
                return {
                    msg: "ton wallet can be used only with TON chain"
                };
            }

            const walletContract = web3.open(this.wallet);
            const currentSeqno = await walletContract.getSeqno();
            const txHash = await walletContract.send(transactionObject.rawTransaction);
            const timer = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
            await timer(5000);
            const seqno = await walletContract.getSeqno();

            if (seqno > currentSeqno) {
                return { seqno, message: "transaction has been sent to the blockchain" };
            }

            return {
                message: "transaction has been sent to the blockchain"
            };
        } catch (error) {
            return error;
        }
    }
}

export { WalletTON };