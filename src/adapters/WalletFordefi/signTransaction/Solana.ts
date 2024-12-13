import crypto from 'crypto';
import fs from 'fs';

interface TransactionObject {
  chainId: string;
  to: string;
  value: string | number;
}

interface AssetIdentifier {
  type: string;
  details: {
    type: string;
    chain: string;
  };
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

const signTransactionSolana = async (
  transactionObject: TransactionObject,
  options: Options
): Promise<Response | Error> => {
  /*
   * Function will sign the transaction payload for Solana-based chains
   */

  try {
    let reqBody: any = {};
    reqBody.vault_id = options.vault_id;
    reqBody.type = 'solana_transaction';
    reqBody.signer_type = 'api_signer';

    // Determine the chain
    const chain = transactionObject.chainId === '901' ? 'solana_devnet' : 'solana_mainnet';

    const path = '/api/v1/transactions';

    // Prepare details object
    const details: any = {
      format: 'hash_binary',
      type: 'solana_transfer',
      to: transactionObject.to,
      value: {
        type: 'value',
        value: transactionObject.value,
      },
      asset_identifier: {
        type: 'solana',
        details: {
          type: 'native',
          chain: chain,
        },
      },
    };

    reqBody.details = details;
    reqBody = JSON.stringify(reqBody);

    const timestamp = Date.now();
    const payload = `${path}|${timestamp}|${reqBody}`;

    // Read private key
    const secretPem = fs.readFileSync(options.privateKeyFile, 'utf8');
    const privateKey = crypto.createPrivateKey(secretPem);

    // Create signature
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

export default { signTransactionSolana } ;