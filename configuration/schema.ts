/**
 * JSON Schema Definition
 * For the functions under chain category,
 * the validation is set on the function level.
 * For example, for function `getBlock()`, the request will be the same, regardless of the chain ID and symbol.
 * Whereas for all the other categories, validations are broken one level down, i.e., to the protocol level.
 */

export const jsonSchema: {
    type: string;
    allOf: Array<{
      if: {
        properties: {
          function: {
            type: string;
            pattern: string;
          };
        };
      };
      then: {
        properties: Record<string, { type: string; [key: string]: any }>;
        required: string[];
      };
    }>;
  } = {
    type: "object",
    allOf: [
      {
        if: {
          properties: {
            function: { type: "string", pattern: "prepareTransaction()" },
          },
        },
        then: {
          properties: {
            chainId: { type: "string" },
            chainSymbol: { type: "string" },
            xApiKey: { type: "string" },
            rpc: { type: "string" },
          },
          required: ["xApiKey"],
        },
      },
      {
        if: {
          properties: {
            function: { type: "string", pattern: "signTransaction()" },
          },
        },
        then: {
          properties: {
            rpc: { type: "string" },
            privateKey: { type: "string" },
            chainId: { type: "string" },
            chainSymbol: { type: "string" },
            key: { type: "string" },
            xApiKey: { type: "string" },
          },
          required: ["xApiKey"],
        },
      },
      {
        if: {
          properties: {
            function: { type: "string", pattern: "transactionObject()" },
          },
        },
        then: {
          properties: {
            from: { type: "string" },
            to: { type: "string" },
            value: { type: "string" },
            gas: { type: "string" },
            data: { type: "string" },
            networkId: { type: "string" },
          },
          required: ["from"],
        },
      },
      {
        if: {
          properties: {
            function: { type: "string", pattern: "tonTxObject()" },
          },
        },
        then: {
          properties: {
            from: { type: "string" },
            to: { type: "string" },
            value: { type: "string" },
            gas: { type: "string" },
            data: { type: "string" },
          },
          required: ["to", "value"],
        },
      },
      {
        if: {
          properties: {
            function: { type: "string", pattern: "txObjSol()" },
          },
        },
        then: {
          properties: {
            from: { type: "string" },
            to: { type: "string" },
            value: { type: "string" },
            gas: { type: "string" },
            data: { type: "string" },
          },
          required: ["from", "to"],
        },
      },
      {
        if: {
          properties: {
            function: { type: "string", pattern: "sendTransaction()" },
          },
        },
        then: {
          properties: {
            chainId: { type: "string" },
            chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
            rawTransaction: { type: "string" },
            signature: { type: "string" },
            xApiKey: { type: "string" },
            rpc: { type: "string" },
          },
          required: ["rawTransaction"],
        },
      },
      {
        if: {
          properties: {
            function: { type: "string", pattern: "TONTransaction()" },
          },
        },
        then: {
          properties: {
            chainId: { type: "string" },
            chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
            rawTransaction: { type: "object" },
            xApiKey: { type: "string" },
            rpc: { type: "string" },
          },
          required: ["rawTransaction"],
        },
      },
      {
        if: {
          properties: {
            function: { type: "string", pattern: "FordefiTransaction()" },
          },
        },
        then: {
          properties: {
            data: { type: "string" },
            timestamp: { type: "number" },
            signature: { type: "string" },
            accessToken: { type: "string" },
          },
          required: ["data", "signature", "accessToken", "timestamp"],
        },
      },
      // Add the rest of the JSON schema mappings here
      // Following the same pattern as the mappings above
    ],
  };
  