import crypto from 'crypto';
import fs from 'fs';

interface TransactionObject {
  chainId?: number | string;
  gas: number;
  to: string;
  value: string | number;
  data?: string;
}

interface Gas {
  type: string;
  priority_level: string;
  gas_limit: number;
}

interface Options {
  vault_id: string;
  privateKeyFile: string;
  accessToken: string;
}

interface Response {
  data: string;
  timestamp: number;
  signature: string;
  accessToken: string;
}

export const signTransactionEvm = async (
  transactionObject: TransactionObject,
  options: Options
): Promise<Response | Error> => {
  /*
   * Function will sign the transaction payload for ethereum-based chains
   */

  try {
    let reqBody: any = {};
    reqBody.type = 'evm_transaction';
    reqBody.vault_id = options.vault_id;

    const path = '/api/v1/transactions';

    const details = { ...transactionObject };
    details.chain = parseInt(transactionObject.chainId as string) || 1;

    const gas: Gas = {
      type: 'priority',
      priority_level: 'medium',
      gas_limit: transactionObject.gas,
    };
    details.gas = gas;
    details.to = transactionObject.to;
    details.value = transactionObject.value;
    details.type = 'evm_raw_transaction';

    if (transactionObject.data) {
      details.data = {
        type: 'hex',
        hex_data: transactionObject.data,
      };
    }

    reqBody.details = details;
    reqBody.signer_type = 'api_signer';
    reqBody = JSON.stringify(reqBody);

    const timestamp = Date.now();
    const payload = `${path}|${timestamp}|${reqBody}`;

    const secretPem = fs.readFileSync(options.privateKeyFile, 'utf8');
    const privateKey = crypto.createPrivateKey(secretPem);

    const sign = crypto.createSign('SHA256').update(payload, 'utf8').end();
    const signature = sign.sign(privateKey, 'base64');

    const response: Response = {
      data: reqBody,
      timestamp,
      signature,
      accessToken: `Bearer ${options.accessToken}`,
    };

    return response;
  } catch (error) {
    return error as Error;
  }
};
