import TronWeb from 'tronweb';

class Tron {
    signTransactionTron = async (web3: any, transactionObject: any, options: any) => {

        try {
            const tronWeb = new TronWeb({
                fullHost: options.rpc,
                privateKey: options.privateKey,
            });
            const tradeobj = await tronWeb.transactionBuilder.sendTrx(
                tronWeb.address.toHex(transactionObject.to),
                transactionObject.value,
                tronWeb.address.toHex(transactionObject.from)
            );
            const signedtxn = await tronWeb.trx.sign(
                tradeobj,
                options.privateKey
            );

            const rawTransaction = Buffer.from(JSON.stringify(signedtxn)).toString("base64");
            return rawTransaction;

        }
        catch (error) {
            return error;
        }
    }
}

export default new Tron();