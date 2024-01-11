const schemaValidator = require('../../configuration/schemaValidator');
const PlaceOrder = require('./placeOrder');
const UserOnboarding = require('./userOnboarding');
const CancelOrder = require('./cancelOrder');
const Transfer = require('./transfer');
const Deposit = require('./deposit');

exports.userOnboarding = async (options) => {
    const filterOptions = options;
    filterOptions.function = "userOnboardingDYDX()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) return (validJson);
    return UserOnboarding.userOnboarding(options);
};

exports.placeOrder = async (options) => {
    let filterOptions = options;

    const {side, type, timeInForce, market} = filterOptions;
    filterOptions = {...filterOptions, side: side && side.toUpperCase(), type: type && type.toUpperCase(), timeInForce: timeInForce && timeInForce.toUpperCase(), market: market && market.toUpperCase()}
    
    filterOptions.function = "placeOrderDYDX()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) return (validJson);
    return PlaceOrder.placeOrder(filterOptions);
};

exports.cancelOrder = async (options) => {
    const filterOptions = options;
    filterOptions.function = "cancelOrderDYDX()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) return (validJson);
    return CancelOrder.cancelOrder(filterOptions);
};

exports.transfer = async (options) => {
    const filterOptions = options;
    filterOptions.function = "transferDYDX()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) return (validJson);
    return Transfer.transfer(filterOptions);
};

exports.deposit = async (options) => {
    const filterOptions = options;
    filterOptions.function = "depositDYDX()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) return (validJson);
    return Deposit.deposit(filterOptions);
};