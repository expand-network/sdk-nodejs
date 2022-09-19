const config = require('./config.json');


const getChainIdFromChainSymbol = async(chainSymbol) => {
    /*
     * This functions returns the appropriate chainId 
     * for the given chainSymbol
     *    
     */

    for(var chain in config.chains){
        if ( config.chains[chain].chainSymbol == chainSymbol ) {
            return chain;
        }
    }

    // Always returning null by default
    return null;

}


exports.getChainId = async(options) => {
    /*
     * This functions returns the appropriate chainId 
     * for the given combination of chainId and chainSymbol
     *    
     */

    var chainId = options.chainId;
    var chainSymbol = options.chainSymbol;

    if ( chainId == null && chainSymbol == null ) {
        // By default setting it to EVM based chains
        chainId = "1"; 
    } else if ( chainId == null && chainSymbol != null ) {
        // Fetch the equivalent chain ID from the configuration File
        chainId = getChainIdFromChainSymbol(chainSymbol);
    } else {
        // By default priority will be given to chainId 
        chainId = chainId.toString();
    }

    return chainId;
}

