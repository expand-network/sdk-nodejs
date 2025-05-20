const { AccountAddress } = require("@aptos-labs/ts-sdk");

function castArgument(arg, type) {
  switch (type) {
    case "address":
      return AccountAddress.fromString(arg);
    case "u64":
      return BigInt(arg);
    case "string":
      return String(arg);
    default:
      return arg;
  }
}

async function decodeSingleTransaction(tx) {
  const jsonStr = Buffer.from(tx, "base64").toString("utf-8");
  const parsed = JSON.parse(jsonStr);

  const types = parsed.argumentsTypes || [];
  const functionArguments = (parsed.functionArguments || []).map((arg, idx) =>
    castArgument(arg, types[idx])
  );

  return {
    function: parsed.function,
    functionArguments,
    typeArguments: parsed.typeArguments || [],
  };
}

async function decodeMultipleTransactions(txObject) {
  const entries = Object.entries(txObject || {});
  return entries.map(([key, tx]) => {
    const jsonStr = Buffer.from(tx.data, "base64").toString("utf-8");
    const parsed = JSON.parse(jsonStr);

    const types = parsed.argumentsTypes || [];
    const functionArguments = (parsed.functionArguments || []).map((arg, idx) =>
      castArgument(arg, types[idx])
    );

    return {
      key,
      function: parsed.function,
      functionArguments,
      typeArguments: parsed.typeArguments || [],
    };
  });
}

module.exports = {
    decodeTransactions: (input, isSingle = true) =>  {
      if (isSingle) {
        return decodeSingleTransaction(input);
      } else {
        return decodeMultipleTransactions(input);
      }}
}