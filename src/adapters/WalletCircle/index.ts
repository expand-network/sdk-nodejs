import { initiateUserControlledWalletsClient } from '@circle-fin/user-controlled-wallets';
import { v4 as uuidv4 } from 'uuid';
import axios, { AxiosRequestConfig } from 'axios';
import * as schemaValidator from '../../../configuration/schemaValidator';
import * as conf from '../../../configuration/config.json';

interface WalletCircleOptions {
  appId: string;
  apiKey: string;
  userId: string;
  userToken: string;
  walletId: string;
  encryptionKey: string;
}

interface TransactionObject {
  value: number;
  data?: string;
  to: string;
  tokenId?: string;
  function?: string;
}

interface ValidObject {
  valid: boolean;
}

class WalletCircle {
  private appId: string;
  private apiKey: string;
  private client: ReturnType<typeof initiateUserControlledWalletsClient>;
  private userId: string;
  private userToken: string;
  private walletId: string;
  private encryptionKey: string;

  constructor(options: WalletCircleOptions) {
    this.appId = options.appId;
    this.apiKey = options.apiKey;
    this.client = initiateUserControlledWalletsClient({
      apiKey: options.apiKey,
    });
    this.userId = options.userId;
    this.userToken = options.userToken;
    this.walletId = options.walletId;
    this.encryptionKey = options.encryptionKey;
  }

  static async getUserToken(options: { apiKey: string; userId: string }): Promise<string> {
    const client = initiateUserControlledWalletsClient({
      apiKey: options.apiKey,
    });
    const userToken = await client.createUserToken({ userId: options.userId }).then(res => res.data);
    return userToken;
  }

  async signTransaction(transactionObject: TransactionObject): Promise<any> {
    const transactionOptions = transactionObject;
    transactionOptions.function = "transactionObject()";
    const validObject: ValidObject = await schemaValidator.validateInput(transactionObject);

    if (!validObject.valid) {
      return validObject;
    }

    if (transactionObject.data) {
      const data = JSON.stringify({
        userId: this.userId,
        idempotencyKey: uuidv4(),
        amounts: [transactionObject.value],
        callData: transactionObject.data,
        contractAddress: transactionObject.to,
        walletId: this.walletId,
        feeLevel: "MEDIUM",
      });

      const config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${conf.circleProgrammableWallet.baseUrl}contractExecution`,
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${this.apiKey}`,
          'X-User-Token': this.userToken,
        },
        data,
      };

      try {
        const challengeId = await axios.request(config).then(res => res.data);
        return challengeId;
      } catch (error: any) {
        return error;
      }
    } else {
      const data = JSON.stringify({
        userId: this.userId,
        idempotencyKey: uuidv4(),
        amounts: [transactionObject.value],
        destinationAddress: transactionObject.to,
        tokenId: transactionObject.tokenId,
        walletId: this.walletId,
        feeLevel: "MEDIUM",
      });

      const config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${conf.circleProgrammableWallet.baseUrl}/transfer`,
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${this.apiKey}`,
          'X-User-Token': this.userToken,
        },
        data,
      };

      try {
        const challengeId = await axios.request(config).then(res => res.data);
        return challengeId;
      } catch (error: any) {
        return error.response?.data;
      }
    }
  }

  async sendTransaction(challengeId: { data: { challengeId: string } }): Promise<Record<string, string>> {
    return {
      appId: this.appId,
      userToken: this.userToken,
      encryptionKey: this.encryptionKey,
      challengeId: challengeId.data.challengeId,
    };
  }
}

export { WalletCircle };
