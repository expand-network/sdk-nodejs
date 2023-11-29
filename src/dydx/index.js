const schemaValidator = require('../../configuration/schemaValidator');
const PlaceOrder = require('./placeOrder');
const UserOnboarding = require('./userOnboarding');
const CancelOrder = require('./cancelOrder');
const Transfer = require('./transfer');

exports.userOnboarding = async (options) => {
    const filterOptions = options;
    filterOptions.function = "userOnboardingDYDX()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
        return (validJson);
    }

    return UserOnboarding.userOnboarding(options);
};

exports.placeOrder = async (options) => {
    const filterOptions = options;
    filterOptions.function = "placeOrderDYDX()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
        return (validJson);
    }

    return PlaceOrder.placeOrder(options);
};

exports.cancelOrder = async (options) => {
    const filterOptions = options;
    filterOptions.function = "cancelOrderDYDX()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
        return (validJson);
    }

    return CancelOrder.cancelOrder(options);
};

exports.transfer = async (options) => {
    const filterOptions = options;
    filterOptions.function = "transferDYDX()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
        return (validJson);
    }

    return Transfer.transfer(options);
};