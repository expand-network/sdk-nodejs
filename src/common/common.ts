import config from '../configuration/config';

export default class Common {
    getChainIdFromChainSymbol = async (chainSymbol: any) => {
        /*
         * This functions returns the appropriate chainId 
         * for the given chainSymbol
         *    
         */
        const upperCaseChainSymbol = chainSymbol.toUpperCase();

        for (const chain in config.chains) {
            if (config.chains[chain].upperCaseChainSymbol === upperCaseChainSymbol) {
                return (chain);
            }
        }

        // Always returning null by default
        return (null);

    };


    getChainId = async (options: any) => {
        /*
         * This functions returns the appropriate chainId 
         * for the given combination of chainId and chainSymbol
         *    
         */

        let chainId = options.chainId ? options.chainId : null;
        const chainSymbol = options.chainSymbol ? options.chainSymbol.toUpperCase() : null;

        if (chainId === null && chainSymbol === null) {
            // By default setting it to EVM based chains
            chainId = "1";
        } else if (chainId === null && chainSymbol != null) {
            // Fetch the equivalent chain ID from the configuration File
            chainId = this.getChainIdFromChainSymbol(chainSymbol);
        } else {
            // By default priority will be given to chainId 
            chainId = chainId.toString();
        }
        return (chainId);

    };
}

