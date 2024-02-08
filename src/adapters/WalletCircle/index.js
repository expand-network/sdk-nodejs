const { initiateUserControlledWalletsClient } = require('@circle-fin/user-controlled-wallets');
const { v4 } = require('uuid');
const axios = require('axios');
const schemaValidator = require('../../../configuration/schemaValidator');
const conf = require('../../../configuration/config.json');


class WalletCircle {
  constructor(options) {
    this.appId = options.appId;
    this.apiKey = options.apiKey;
    this.client = initiateUserControlledWalletsClient({
      apiKey: options.apiKey,
    });
    this.userId = options.userId;
    this.userToken = options.userToken;
    this.walletId = options.walletId;
    this.encryptionKey = options.encryptionKey;
  };

  static getUserToken = async (options) => {
    const client = initiateUserControlledWalletsClient({
      apiKey: options.apiKey,
    });
    const userToken = await client.createUserToken({ userId: options.userId }).then(res => res.data);
    return userToken;
  };

  signTransaction = async (transactionObject) => {
    const transactionOptions = transactionObject;
    transactionOptions.function = "transactionObject()";
    const validObject = await schemaValidator.validateInput(transactionObject);

    if (!validObject.valid) {
      return (validObject);
    }

    if (transactionObject.data) {
      let data = JSON.stringify({
        "userId": this.userId,
        "idempotencyKey": v4(),
        "amounts": [
          transactionObject.value
        ],
        "callData": transactionObject.data,
        "contractAddress": transactionObject.to,
        "walletId": this.walletId,
        "feeLevel": "MEDIUM"
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${conf.circleProgrammableWallet.baseUrl}contractExecution`,
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${this.apiKey}`,
          'X-User-Token': this.userToken,
        },
        data: data
      };
      try {
        const challengeId = await axios.request(config).then(res => res.data);
        return challengeId;
        // const response = {};
        // response.appId = this.appId;
        // response.userToken = this.userToken;
        // response.encryptionKey = this.encryptionKey;
        // response.challengeId = challengeId;
        // return response;
      } catch (error) {
        return error;
      }
    } else {
      let data = JSON.stringify({
        "userId": this.userId,
        "idempotencyKey": v4(),
        "amounts": [
          transactionObject.value
        ],
        "destinationAddress": transactionObject.to,
        "tokenId": transactionObject.tokenId,
        "walletId": this.walletId,
        "feeLevel": "MEDIUM"
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${conf.circleProgrammableWallet.baseUrl}/transfer`,
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${this.apiKey}`,
          'X-User-Token': this.userToken,
        },
        data: data
      };

      try {

        const challengeId = await axios.request(config).then(res => res.data);
        return challengeId;
        // const response = {};
        // response.appId = this.appId;
        // response.userToken = this.userToken;
        // response.encryptionKey = this.encryptionKey;
        // response.challengeId = challengeId;
        // return response;
      } catch (error) {
        return error.response.data;
      }

    }

  };

  sendTransaction = async (challengeId) => {

    const response = {};
    response.appId = this.appId;
    response.userToken = this.userToken;
    response.encryptionKey = this.encryptionKey;
    response.challengeId = challengeId.data.challengeId;
    return response;

  }

}

module.exports = { WalletCircle };