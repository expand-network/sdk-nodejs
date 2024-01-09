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
                    function: { type:"string", pattern: "prepareTransaction()" },
                } 
            },
            then: {
                properties: {
                    chainId: {type : "string"},
                    chainSymbol: {type: "string"},
                    xApiKey: {type : "string"},
                    rpc: {type: "string"}

                },
                required: ["xApiKey"] 
            },
        },

        // Field Mapping for signTransaction() function
        {
            if: { 
                properties: {
                    function: { type:"string", pattern: "signTransaction()" },
                } 
            },
            then: {
                properties: {
                    rpc: {type: "string"},
                    privateKey: {type: "string"},
                    chainId: {type: "string"},
                    chainSymbol: {type: "string"},
                    key: {type: "string"},
                    xApiKey: {type:"string"}
                },
                required: ["xApiKey"] 
            },
        },

        // Field Mapping for transactionObject() function

        {
            if: { 
                properties: {
                    function: { type:"string", pattern: "transactionObject()" },
                } 
            },
            then: {
                properties:{
                    from: {type: "string"},
                    to: {type: "string"},
                    value: {type : "string"},
                    gas: {type : "string"},
                    data: {type: "string"},
                    networkId: {type : "string"}
                },

                required: ["from","to","value"]
            }
            
        },

        // Field Mapping for sendTransaction() function
        {
            if: { 
                properties: {
                    function: { type:"string", pattern: "sendTransaction()" },
                } 
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                    rawTransaction: {type: "string"},
                    signature: { type: "string" },
                    xApiKey: {type : "string"},
                    rpc: {type: "string"}
                },
                required: ["rawTransaction"] 
            },
        },

        {
            if: { 
                properties: {
                    function: { type:"string", pattern: "TONTransaction()" },
                } 
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                    rawTransaction: {type: "object"},
                    xApiKey: {type : "string"},
                    rpc: {type: "string"}
                },
                required: ["rawTransaction"] 
            },
        },

        {
            if: { 
                properties: {
                    function: { type:"string", pattern: "FordefiTransaction()" },
                } 
            },
            then: {
                properties: {
                    data: { type: "string" },
                    timestamp: { type: "number" },
                    signature: {type: "string"},
                    accessToken: {type : "string"},
                },
                required: ["data","signature","accessToken", "timestamp"] 
            },
        },

        // Fireblocks

        {
            if: { 
                properties: {
                    function: { type:"string", pattern: "FireblockSign()" },
                } 
            },
            then: {
                properties: {
                    from: { type: "string" },
                    assetId: { type: "string" },
                    data: { type: "string" },
                    note: {type: "string"},
                    amount: {type: "string"}
                },
                required: ["from"] 
            },
        },

        {
            if: { 
                properties: {
                    function: { type:"string", pattern: "SendFireblocks()" },
                } 
            },
            then: {
                properties: {
                    jwt: { type: "string" },
                    path: { type: "string" },
                    data: { type: "object" },
                    method: { type: "string",  }
                },
                required: ["jwt", "data"] 
            },
        },

    ]
};