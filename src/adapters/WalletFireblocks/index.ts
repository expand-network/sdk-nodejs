import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import config from '../../../configuration/config';
import * as common from '../../../configuration/common';
import * as schemaValidator from '../../../configuration/schemaValidator';

interface WalletFireblocksOptions {
    baseUrl?: string;
    apiSecret: string;
    apiKey: string;
}

interface TransactionObject {
    chainId: string;
    chainSymbol: string;
    from: string;
    to: string;
    value?: number;
    assetId?: string;
    assetDecimals?: number;
    note?: string;
    data?: string;
    internal?: boolean;
    function?: string;
}

interface RawTransaction {
    jwt: string;
    path: string;
    data: any;
    method: string;
    function?: string;
}

class WalletFireblocks {
    private baseUrl: string;
    private apiSecret: string;
    private apiKey: string;

    constructor(options: WalletFireblocksOptions) {
        this.baseUrl = options.baseUrl || config.fireblocks.baseUrl;
        this.apiSecret = options.apiSecret;
        this.apiKey = options.apiKey;
    }

    private jwtSign(path: string, data: any): string {
        const token = jwt.sign(
            {
                uri: path,
                nonce: uuidv4(),
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 55,
                sub: this.apiKey,
                bodyHash: crypto.createHash('sha256').update(JSON.stringify(data || '')).digest().toString('hex'),
            },
            this.apiSecret,
            { algorithm: 'RS256' }
        );
        return token;
    }

    public signTransaction = async (transactionObject: TransactionObject): Promise<RawTransaction | any> => {
        try {
            transactionObject.function = 'FireblockSign()';
            const validJson = await schemaValidator.validateInput(transactionObject);

            if (!validJson.valid) {
                return validJson;
            }

            const chainId = await common.getChainId({ chainId: transactionObject.chainId, chainSymbol: transactionObject.chainSymbol });
            const chainName = config.chains[chainId as keyof typeof config.chains].chainName;

            const txData: any = {
                operation: transactionObject.data ? 'CONTRACT_CALL' : 'TRANSFER',
                source: {
                    type: 'VAULT_ACCOUNT',
                    id: transactionObject.from,
                },
            };

            if (transactionObject.internal) {
                txData.destination = {
                    type: 'VAULT_ACCOUNT',
                    id: transactionObject.to,
                };
            } else {
                txData.destination = {
                    type: 'ONE_TIME_ADDRESS',
                    oneTimeAddress: {
                        address: transactionObject.to,
                    },
                };
            }

            const assetDecimals = transactionObject.assetDecimals || 18;
            txData.assetId = transactionObject.assetId || 'ETH_TEST3';
            txData.amount = transactionObject.value ? transactionObject.value / 10 ** assetDecimals : '0';
            txData.note = transactionObject.note || 'expand';

            if (transactionObject.data) {
                txData.extraParameters = {
                    contractCallData: transactionObject.data,
                };
            }

            const signature = this.jwtSign('/v1/transactions', txData);
            const rawTx: RawTransaction = {
                jwt: signature,
                path: config.fireblocks.createTransaction,
                data: txData,
                method: 'POST',
            };

            return rawTx;
        } catch (error) {
            return error;
        }
    };

    public sendTransaction = async (rawTx: RawTransaction): Promise<any> => {
        try {
            rawTx.function = 'SendFireblocks()';
            const validJson = await schemaValidator.validateInput(rawTx);

            if (!validJson.valid) {
                return validJson;
            }

            const response = await axios({
                url: `${this.baseUrl}${rawTx.path}`,
                method: rawTx.method,
                data: rawTx.data,
                headers: {
                    'X-API-Key': this.apiKey,
                    Authorization: `Bearer ${rawTx.jwt}`,
                },
            });

            return response.data;
        } catch (error:any) {
            console.error(error);
            return error.data;
        }
    };
}

export { WalletFireblocks };
