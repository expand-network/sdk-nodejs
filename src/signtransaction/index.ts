import Algorand from "./algorand";
import Ethereum from "./ethreum";
import Near from "./near";
import Solana from "./solana";
import Tron from "./tron";

export default class MainSdk {
    signTransactionAlgorand = async (web3, transactionObject, options) => {

        const rawData = await Algorand.prototype.signTransactionAlgorand(web3, transactionObject, options);
        return rawData;

    };

    signTransactionEvm = async (web3, transactionObject, options) => {

        const rawData = await Ethereum.prototype.signTransactionEvm(web3, transactionObject, options);
        return rawData;
    };

    signTransactionNear = async (web3, transactionObject, options) => {

        const rawData = await Near.prototype.signTransactionNear(web3, transactionObject, options);
        return rawData;

    };

    signTransactionTron = async (web3, transactionObject, options) => {

        const rawData = await Tron.prototype.signTransactionTron(web3, transactionObject, options);
        return rawData;
    };

    signTransactionSolana = async (web3, transactionObject, options) => {

        const rawData = await Solana.prototype.signTransactionSolana(web3, transactionObject, options);
        return rawData;
    };
}