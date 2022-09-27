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
                    xapikey : {type : "string"},
                    rpc: {type: "string"}

                },
                required: ["xapikey"] 
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
                    privateKey:{type: "string"},
                    chainId:{type: "string"},
                    chainSymbol: {type: "string"},
                    key: {type: "string"},
                    xapikey: {type:"string"}
                },
                required: ["privateKey","xapikey"] 
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
                    value:{type : "string"},
                    gas:{type : "string"},
                    data : {type: "string"}
                },

                required: ["from","to","value","gas"]
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
                    rawTransaction : {type: "string"},
                    xapikey : {type : "string"},
                    rpc: {type: "string"}
                },
                required: ["rawTransaction","xapikey"] 
            },
        },

    ]
}