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
                required: ["privateKey", "xApiKey"]
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
                    xApiKey: { type: "string" },
                    rpc: { type: "string" }
                },
                required: ["rawTransaction", "xApiKey"]
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
                    type: { type: "string" },
                    side: { type: "string" },
                    timeInForce: { type: "string", default: "GTT", enum: ["GTT", "IOC", "FOK"] },
                    time: { type: "string", default: "60" },
                    price: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    postOnly: { type: "string", default: "false", enum: ["true", "false"] },
                    reduceOnly: { type: "string", default: "false", enum: ["true", "false"] },
                    triggerPrice: { type: "string", default: "null" },
                },
                required: ["subAccountNumber", "mnemonic", "market", "type", "side", "price"]
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
                    orderId: { type: "string" }
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
                        recipientSubAccountNumber: { type: "string" },
                        amount: { type: "string" },                        
                    },
                    required: ["subAccountNumber", "mnemonic", "recipient", "recipientSubAccountNumber", "amount"]
                },
            },
    ]
};