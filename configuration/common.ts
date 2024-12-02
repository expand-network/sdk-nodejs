import config from './config.json';

type ChainConfig = {
    chains: {
        [key: string]: {
            localName: string;
            chainName: string;
            chainSymbol: string;
        };
    };
};

type Options = {
    chainId?: string | number | null;
    chainSymbol?: string | null;
};

const getChainIdFromChainSymbol = async (chainSymbol: string): Promise<string | null> => {
    const upperCaseChainSymbol = chainSymbol.toUpperCase();

    for (const chain in (config as ChainConfig).chains) {
        if ((config as ChainConfig).chains[chain].chainSymbol.toUpperCase() === upperCaseChainSymbol) {
            return chain;
        }
    }

    return null;
}

export const getChainId = async (options: Options): Promise<string | null> => {
    /*
     * This function returns the appropriate chainId 
     * for the given combination of chainId and chainSymbol
     */

    let chainId: string | null = options.chainId ? options.chainId.toString() : null;
    const chainSymbol: string | null = options.chainSymbol ? options.chainSymbol.toUpperCase() : null;

    if (chainId === null && chainSymbol === null) {
        // By default setting it to EVM based chains
        chainId = "1";
    } else if (chainId === null && chainSymbol != null) {
        // Fetch the equivalent chain ID from the configuration file
        chainId = await getChainIdFromChainSymbol(chainSymbol);
    } else if (chainId != null) {
        // Ensure chainId is a string
        chainId = chainId.toString();
    }

    return chainId;
};
