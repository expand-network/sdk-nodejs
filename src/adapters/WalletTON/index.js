const { mnemonicToPrivateKey, keyPairFromSecretKey} = require("ton-crypto");
const { WalletContractV4, internal } = require("@ton/ton");
const schemaValidator = require('../../../configuration/schemaValidator');
const common = require('../../../configuration/common');
const { initialiseWeb3 } = require("../../../configuration/intialiseWeb3");
const config = require('../../../configuration/config.json');


class WalletTON {
    
    constructor (options){
        this.privateKey = Buffer.from(options.privateKey, 'hex'),
        this.keyPair = keyPairFromSecretKey(this.privateKey);
        this.xApiKey = options.xApiKey
        const wallet = WalletContractV4.create({ publicKey: this.keyPair.publicKey, workchain: 0 });
        this.wallet = wallet;
    }

    static getPrivateKey = async ( mnemonic ) => {
        const arr = mnemonic.split(" ");
        this.keyPair = await mnemonicToPrivateKey(arr);
        const privateKey = Buffer.from(this.keyPair.secretKey).toString('hex');
        return privateKey;
    }

    signTransaction = async (transactionObject) => {

        const configuration = { "params": {} };
        transactionObject.function = "transactionObject()";
        const validJson = await schemaValidator.validateInput(transactionObject);

        if(! validJson.valid){
            return validJson;
        }

        const chainId = await common.getChainId({chainId:transactionObject.chainId,chainSymbol:transactionObject.chainSymbol});
        let chainName = config.chains[chainId].chainName;

        if(chainName!=="TON"){
            return {
                "msg": "ton wallet can be used only with TON chain"
            }
        };

        const web3 = await initialiseWeb3({chainId,key:this.xApiKey});
        const walletContract = web3.open(this.wallet);

        const seqno = await walletContract.getSeqno();
        const rawData = await walletContract.createTransfer({
            secretKey: this.privateKey,
            seqno: seqno,
            messages: [
                internal({
                    to: transactionObject.to,
                    value: transactionObject.value, 
                    body: transactionObject.message?transactionObject.message:"through expand", // optional comment
                    bounce: false,
                })
            ]
        });

        return { rawTransaction: rawData, chainId: chainId};


    }

    sendTransaction = async (transactionObject) => {

        transactionObject.function = "TONTransaction()";
        const validJson = await schemaValidator.validateInput(transactionObject);
        if ( !validJson.valid ) {
            return (validJson);
        }

        try{

            const chainId = await common.getChainId({chainId:transactionObject.chainId,chainSymbol:transactionObject.chainSymbol});
            let chainName = config.chains[chainId].chainName;
            const web3 = await initialiseWeb3({chainId,key:this.xApiKey});

            if(chainName!=="TON"){
                return {
                    "msg": "ton wallet can be used only with TON chain"
                }
            };

            const walletContract = web3.open(this.wallet);
            const currentseqno = await walletContract.getSeqno();
            await walletContract.send(transactionObject.rawTransaction);
            const timer = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            await timer(5000);
            let seqno = await walletContract.getSeqno();
            if(seqno>currentseqno){
                return { seqno: seqno, message: "transaction has been sent to the blockchain" }
            }

            return {
                "message": "transaction has been sent to the blockchain",
            };

        }catch(error){
            return error;
        }
    }


}

module.exports = { WalletTON }; 