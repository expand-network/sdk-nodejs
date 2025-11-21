const { prepareTransaction, Wallet } = require('../src');
const axios = require('axios');
const config = require('../configuration/config.json');


jest.mock('axios');

describe('AddLiquidity - prepareTransaction', () => {
  
  beforeEach(() => {
    
    jest.clearAllMocks();
  });

  describe('chainSymbol to chainId conversion', () => {
    
    it('should convert BSC chainSymbol to chainId 56', async () => {
      const mockResponse = {
        data: {
          data: {
            from: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
            to: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
            gas: '544672',
            data: '0x...'
          }
        }
      };
      
      axios.mockResolvedValue(mockResponse);

      const options = {
        dexId: '1307',
        tokenA: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        tokenB: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        poolFees: '3000',
        amountADesired: '100000000000000',
        amountBDesired: '0',
        amountAMin: '0',
        amountBMin: '0',
        deadline: '1797485659',
        to: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
        from: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
        gas: '544672',
        chainSymbol: 'BSC',
        xApiKey: 'test-api-key',
        gasPriority: 'medium'
      };

      const result = await prepareTransaction('https://api.expand.network/dex/addliquidity', options);
      
      expect(result.chainId).toBe('56');
    });

    it('should convert ETH chainSymbol to chainId 1', async () => {
      const mockResponse = {
        data: {
          data: {
            from: '0x123',
            to: '0x456',
            gas: '100000'
          }
        }
      };
      
      axios.mockResolvedValue(mockResponse);

      const options = {
        dexId: '1000',
        chainSymbol: 'ETH',
        xApiKey: 'test-api-key',
        from: '0x123',
        to: '0x456'
      };

      const result = await prepareTransaction('https://api.expand.network/dex/addliquidity', options);
      
      expect(result.chainId).toBe('1');
    });

    it('should convert MATIC chainSymbol to chainId 137', async () => {
      const mockResponse = {
        data: {
          data: {
            from: '0x123',
            to: '0x456'
          }
        }
      };
      
      axios.mockResolvedValue(mockResponse);

      const options = {
        chainSymbol: 'MATIC',
        xApiKey: 'test-api-key',
        from: '0x123',
        to: '0x456'
      };

      const result = await prepareTransaction('https://api.expand.network/dex/addliquidity', options);
      
      expect(result.chainId).toBe('137');
    });

    it('should convert SOL chainSymbol to chainId 900', async () => {
      const mockResponse = {
        data: {
          data: {
            from: 'solana-address',
            to: 'solana-address'
          }
        }
      };
      
      axios.mockResolvedValue(mockResponse);

      const options = {
        chainSymbol: 'SOL',
        xApiKey: 'test-api-key',
        from: 'solana-address'
      };

      const result = await prepareTransaction('https://api.expand.network/dex/swap', options);
      
      expect(result.chainId).toBe('900');
    });

    it('should handle chainId when already provided (not convert from chainSymbol)', async () => {
      const mockResponse = {
        data: {
          data: {
            from: '0x123',
            to: '0x456'
          }
        }
      };
      
      axios.mockResolvedValue(mockResponse);

      const options = {
        chainId: '42161', 
        chainSymbol: 'BSC', 
        xApiKey: 'test-api-key',
        from: '0x123'
      };

      const result = await prepareTransaction('https://api.expand.network/dex/addliquidity', options);
      
      // Should keep the provided chainId, not convert from chainSymbol
      expect(result.chainId).toBe('42161');
    });

    it('should not set chainId when chainSymbol is invalid', async () => {
      const mockResponse = {
        data: {
          data: {
            from: '0x123',
            to: '0x456'
          }
        }
      };
      
      axios.mockResolvedValue(mockResponse);

      const options = {
        chainSymbol: 'INVALID_CHAIN',
        xApiKey: 'test-api-key',
        from: '0x123'
      };

      const result = await prepareTransaction('https://api.expand.network/dex/addliquidity', options);
      
      expect(result.chainId).toBeUndefined();
    });
  });

  describe('prepareTransaction API call', () => {
    
    it('should make API call with correct headers and data', async () => {
      const mockResponse = {
        data: {
          data: {
            from: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
            to: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
            gas: '544672'
          }
        }
      };
      
      axios.mockResolvedValue(mockResponse);

      const options = {
        dexId: '1307',
        tokenA: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        tokenB: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        chainSymbol: 'BSC',
        xApiKey: 'test-api-key',
        from: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45'
      };

      await prepareTransaction('https://api.expand.network/dex/addliquidity', options);
      
      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: 'https://api.expand.network/dex/addliquidity',
          headers: {
            'x-api-key': 'test-api-key'
          }
        })
      );
    });

    it('should return transaction data with chainId set', async () => {
      const mockResponse = {
        data: {
          data: {
            from: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
            to: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
            gas: '544672',
            data: '0x123456'
          }
        }
      };
      
      axios.mockResolvedValue(mockResponse);

      const options = {
        dexId: '1307',
        chainSymbol: 'BSC',
        xApiKey: 'test-api-key',
        from: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45'
      };

      const result = await prepareTransaction('https://api.expand.network/dex/addliquidity', options);
      
      expect(result).toHaveProperty('from');
      expect(result).toHaveProperty('to');
      expect(result).toHaveProperty('gas');
      expect(result).toHaveProperty('chainId', '56');
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      axios.mockRejectedValue(mockError);

      const options = {
        dexId: '1307',
        chainSymbol: 'BSC',
        xApiKey: 'test-api-key',
        from: '0x123'
      };

      const result = await prepareTransaction('https://api.expand.network/dex/addliquidity', options);
      
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('API Error');
    });
  });

  describe('validation tests', () => {
    
    it('should return validation error when xApiKey is missing', async () => {
      const options = {
        dexId: '1307',
        chainSymbol: 'BSC',
        from: '0x123'
        // xApiKey is missing
      };

      const result = await prepareTransaction('https://api.expand.network/dex/addliquidity', options);
      
      expect(result.valid).toBe(false);
      expect(result.code).toBe(400);
    });
  });

  describe('multiple chain support', () => {
    
    const testCases = [
      { chainSymbol: 'BSC', expectedChainId: '56', name: 'Binance Smart Chain' },
      { chainSymbol: 'ETH', expectedChainId: '1', name: 'Ethereum Mainnet' },
      { chainSymbol: 'MATIC', expectedChainId: '137', name: 'Polygon' },
      { chainSymbol: 'AVAL', expectedChainId: '43114', name: 'Avalanche' },
      { chainSymbol: 'AETH', expectedChainId: '42161', name: 'Arbitrum' },
      { chainSymbol: 'OPT', expectedChainId: '10', name: 'Optimism' },
      { chainSymbol: 'FTM', expectedChainId: '250', name: 'Fantom' },
      { chainSymbol: 'BASE', expectedChainId: '8453', name: 'Base' }
    ];

    testCases.forEach(({ chainSymbol, expectedChainId, name }) => {
      it(`should convert ${name} (${chainSymbol}) to chainId ${expectedChainId}`, async () => {
        const mockResponse = {
          data: {
            data: {
              from: '0x123',
              to: '0x456'
            }
          }
        };
        
        axios.mockResolvedValue(mockResponse);

        const options = {
          chainSymbol,
          xApiKey: 'test-api-key',
          from: '0x123'
        };

        const result = await prepareTransaction('https://api.expand.network/dex/addliquidity', options);
        
        expect(result.chainId).toBe(expectedChainId);
      });
    });
  });

  describe('config verification', () => {
    
    it('should have BSC chain configuration', () => {
      const bscConfig = config.chains['56'];
      expect(bscConfig).toBeDefined();
      expect(bscConfig.chainSymbol).toBe('BSC');
      expect(bscConfig.localName).toBe('BinanceSmartChain');
    });

    it('should have ETH chain configuration', () => {
      const ethConfig = config.chains['1'];
      expect(ethConfig).toBeDefined();
      expect(ethConfig.chainSymbol).toBe('ETH');
      expect(ethConfig.localName).toBe('Ethereum');
    });
  });
});

describe('AddLiquidity - Full Integration', () => {
  
  it('should prepare add liquidity transaction with all parameters', async () => {
    const mockResponse = {
      data: {
        data: {
          from: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
          to: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
          value: '0',
          gas: '544672',
          gasPrice: '5000000000',
          nonce: 10,
          data: '0x1234567890abcdef'
        }
      }
    };
    
    axios.mockResolvedValue(mockResponse);

    const options = {
      dexId: '1307',
      tokenA: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      tokenB: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      poolFees: '3000',
      amountADesired: '100000000000000',
      amountBDesired: '0',
      amountAMin: '0',
      amountBMin: '0',
      deadline: '1797485659',
      to: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
      from: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
      gas: '544672',
      chainSymbol: 'BSC',
      xApiKey: 'test-api-key',
      gasPriority: 'medium'
    };

    const result = await prepareTransaction('https://api.expand.network/dex/addliquidity', options);
    
    expect(result).toBeDefined();
    expect(result.chainId).toBe('56');
    expect(result.from).toBe('0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45');
    expect(result.to).toBe('0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45');
    expect(result.gas).toBe('544672');
  });
});

