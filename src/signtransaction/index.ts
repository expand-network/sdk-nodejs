import Algorand from "./algorand";
import Ethereum from "./ethreum";
import Near from "./near";
import Solana from "./solana";
import Tron from "./tron";

class MainSdk {
    signTransactionAlgorand = async (web3, transactionObject, options) => {

        const rawData = await Algorand.signTransactionAlgorand(web3, transactionObject, options);
        return rawData;

    };

    signTransactionEvm = async (web3, transactionObject, options) => {

        const rawData = await Ethereum.signTransactionEvm(web3, transactionObject, options);
        return rawData;
    };

    // signTransactionNear = async (web3, transactionObject, options) => {

    //     const rawData = await Near.prototype.signTransactionNear(web3, transactionObject, options);
    //     return rawData;

    // };

    signTransactionTron = async (web3, transactionObject, options) => {

        const rawData = await Tron.signTransactionTron(web3, transactionObject, options);
        return rawData;
    };

    signTransactionSolana = async (web3, transactionObject, options) => {

        const rawData = await Solana.signTransactionSolana(web3, transactionObject, options);
        return rawData;
    };
}

export default new MainSdk();