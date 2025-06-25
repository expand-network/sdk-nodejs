const {
    xdr,
    StrKey
  } = require("@stellar/stellar-sdk");

const schemaValidator = require('../../configuration/schemaValidator');
const { bufferToString, getTransactionByHash } = require('./helpers');

module.exports = {
    getAllAssets: async (options) => {
        const filterOptions = options;
        filterOptions.function = "stellarDecodeTransaction()";
        const validJson = await schemaValidator.validateInput(filterOptions);
        if (!validJson.valid) {
        return (validJson);
        }
        const {chainId, transactionHash } = filterOptions;
        try {
        let getResponse = await getTransactionByHash(chainId,transactionHash);
        while (getResponse.result.status === "NOT_FOUND") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            getResponse = await getTransactionByHash(chainId,transactionHash);
        }
            if (!getResponse.result.resultMetaXdr) {
            throw new Error("Empty resultMetaXDR in getTransaction response");
            }
            let transactionMeta = getResponse.result.resultMetaXdr;
            let xdrBuffer = Buffer.from(transactionMeta, 'base64');
            let resultMeta = xdr.TransactionMeta.fromXDR(xdrBuffer);
            let sorobanMeta = resultMeta.v3().sorobanMeta();
            let returnValue = sorobanMeta.returnValue();  
            let response = returnValue.value();
            if(response){
                return response.map(assetResponse => {
                    const assetValues = assetResponse._value;
                    const attributes = assetValues[3]._attributes.val._value._attributes;
                    const fullValue = (attributes.hi._value << 64n) + attributes.lo._value;
            
                    return {
                        [assetValues[1]._attributes.key._value]: bufferToString(assetValues[1]._attributes.val._value),
                        [assetValues[2]._attributes.key._value]: StrKey.encodeEd25519PublicKey(assetValues[2]._attributes.val._value._value._value),
                        [assetValues[3]._attributes.key._value]: fullValue.toString(),
                        [assetValues[0]._attributes.key._value]: assetValues[0]._attributes.val._value
                    };
                });
            }
            else{
                return null;
            }
        } catch (err) {
            console.error("Transaction not found", err);
            return null;
        }
    }
}