/*
* For the functions under chain category, 
* the validation is set on the function level
* For example, for funciton getBlock() the request will be same, regardless of the chain ID and symbol 
* Whereas for all the other category, validations are broken one level down, i.e. to the protocol level
*
*/

exports.jsonSchema = {

    type: "object",

    allOf: [

        // Field Mapping for prepareTransaction() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "prepareTransaction()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    xApiKey: { type: "string" },
                    rpc: { type: "string" }

                },
                required: ["xApiKey"]
            },
        },

        // Field Mapping for signTransaction() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "signTransaction()" },
                }
            },
            then: {
                properties: {
                    rpc: { type: "string" },
                    privateKey: { type: "string" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    key: { type: "string" },
                    xApiKey: { type: "string" }
                },
                required: ["xApiKey"]
            },
        },

        // Field Mapping for transactionObject() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "transactionObject()" },
                }
            },
            then: {
                properties: {
                    from: { type: "string" },
                    to: { type: "string" },
                    value: { type: "string" },
                    gas: { type: "string" },
                    data: { type: "string" },
                    networkId: { type: "string" }
                },

                required: ["from", "to", "value"]
            }

        },

        // Field Mapping for tontransactionObject() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "tonTxObject()" },
                }
            },
            then: {
                properties: {
                    from: { type: "string" },
                    to: { type: "string" },
                    value: { type: "string" },
                    gas: { type: "string" },
                    data: { type: "string" }
                },

                required: [ "to", "value"]
            }

        },

        // Field Mapping for txObjSol() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "txObjSol()" },
                }
            },
            then: {
                properties: {
                    from: { type: "string" },
                    to: { type: "string" },
                    value: { type: "string" },
                    gas: { type: "string" },
                    data: { type: "string" },
                },

                required: ["from", "to"]
            }

        },

        // Field Mapping for sendTransaction() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "sendTransaction()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                    rawTransaction: { type: "string" },
                    signature: { type: "string" },
                    xApiKey: { type: "string" },
                    rpc: { type: "string" }
                },
                required: ["rawTransaction"]
            },
        },

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "TONTransaction()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                    rawTransaction: { type: "object" },
                    xApiKey: { type: "string" },
                    rpc: { type: "string" }
                },
                required: ["rawTransaction"]
            },
        },

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "FordefiTransaction()" },
                }
            },
            then: {
                properties: {
                    data: { type: "string" },
                    timestamp: { type: "number" },
                    signature: { type: "string" },
                    accessToken: { type: "string" },
                },
                required: ["data", "signature", "accessToken", "timestamp"]
            },
        },

        // Fireblocks

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "FireblockSign()" },
                }
            },
            then: {
                properties: {
                    from: { type: "string" },
                    assetId: { type: "string" },
                    data: { type: "string" },
                    note: { type: "string" },
                    amount: { type: "string" }
                },
                required: ["from"]
            },
        },

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "SendFireblocks()" },
                }
            },
            then: {
                properties: {
                    jwt: { type: "string" },
                    path: { type: "string" },
                    data: { type: "object" },
                    method: { type: "string", }
                },
                required: ["jwt", "data"]
            },
        },

        // Field Mapping for stellarSignTransaction() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "stellarSignTransaction()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    data: { type: "string" },
                    rpc: { type: "string" },
                },
                required: ["data"]
            },
        },

        // Field Mapping for userOnboardingDYDX() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "userOnboardingDYDX()" },
                }
            },
            then: {
                properties: {
                    privateKey: { type: "string" }
                },
                required: ["privateKey"]
            },
        },

        // Field Mapping for signOrderRFQ() function
        {
            if: { 
                properties: {
                    function: { type:"string", pattern: "signOrderRFQ()" },
                } 
            },
            then: {
                properties: {
                    dexId: { type: "string", enum: ["1900", "1901"], default: "1900" },
                    domain: { type: "object" },
                    types: { type: "object" },
                    values: { type: "object" }
                },
                required: ["domain", "types", "values"] 
            },
        },
        
        // Field Mapping for placeOrderDYDX() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "placeOrderDYDX()" },
                }
            },
            then: {
                properties: {
                    subAccountNumber: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive" },
                    mnemonic: { type: "string" },
                    market: { type: "string" },
                    type: { type: "string", enum: ['LIMIT', 'MARKET'] },
                    side: { type: "string", enum: ['SELL', 'BUY'] },
                    timeInForce: { type: "string", default: "IOC", enum: ["GTT", "IOC", "FOK"] },
                    time: { type: "string", default: "60" },
                    price: { type: "string" },
                    size: { type: "string" },
                    postOnly: { type: "string", default: "false", enum: ["true", "false"] },
                    reduceOnly: { type: "string", default: "false", enum: ["true", "false"] },
                    triggerPrice: { type: "string", default: "null" },
                },
                required: ["subAccountNumber", "size", "mnemonic", "market", "type", "side", "price"],
            },
        },

        // Field Mapping for cancelOrderDYDX() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "cancelOrderDYDX()" },
                }
            },
            then: {
                properties: {
                    subAccountNumber: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive" },
                    mnemonic: { type: "string" },
                    orderId: { type: "string" },
                    goodTillTimeInSeconds: { type: "string", default: '500' }
                },
                required: ["subAccountNumber", "mnemonic", "orderId"]
            },
        },

        // Field Mapping for transferDYDX() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "transferDYDX()" },
                }
            },
            then: {
                properties: {
                    subAccountNumber: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive" },
                    mnemonic: { type: "string" },
                    recipient: { type: "string" },
                    assetId: { type: "string", default: "0", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive" },
                    amount: { type: "string" },
                },
                required: ["subAccountNumber", "mnemonic", "recipient", "amount"]
            },
        },

        // Field Mapping for depositDYDX() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "depositDYDX()" },
                }
            },
            then: {
                properties: {
                    amountIn: { type: "string" },
                    from: { type: "string" },
                    slippage: { type: "string", default: "1" },
                    srcChainId: { type: "string", default: "5", enum: ["5", "97", "80001", "420", "43113", "4002"] },
                    tokenIn: { type: "string" },
                    to: { type: "string" },
                    gas: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive" },
                    privateKey: { type: "string" },
                },
                required: ["amountIn", "to", "gas", "from", "tokenIn", "privateKey"]
            },
        },
    ]
};