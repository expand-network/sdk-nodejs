import * as CancelOrder from './cancelOrder';
import * as Deposit from './deposit';
import * as PlaceOrder from './placeOrder';
import * as Transfer from './transfer';
import * as UserOnboarding from './userOnboarding';
import * as schemaValidator from '../../configuration/schemaValidator';

interface Options {
    side?: string;
    type?: string;
    timeInForce?: string;
    market?: string;
    [key: string]: any;
}

interface ValidationResult {
    valid: boolean;
    errors?: string[];
    [key: string]: any;
}

interface CancelOrderOptions {
    subAccountNumber: string;
    mnemonic: string;
    orderId: string;
    goodTillTimeInSeconds: number;
    function: string;
    side?: string;
    type?: string;
    timeInForce?: string;
    market?: string;
}

export const userOnboarding = async (options: Options): Promise<any> => {
    const filterOptions = { ...options, function: "userOnboardingDYDX()" };
    const validJson: ValidationResult = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) return validJson;
    return UserOnboarding.userOnboarding(options);
};

export const placeOrder = async (options: Options): Promise<any> => {
    let filterOptions = options;

    const { side, type, timeInForce, market } = filterOptions;
    filterOptions = {
        ...filterOptions,
        side: side?.toUpperCase(),
        type: type?.toUpperCase(),
        timeInForce: timeInForce?.toUpperCase(),
        market: market?.toUpperCase(),
        function: "placeOrderDYDX()",
    };

    const validJson: ValidationResult = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) return validJson;
    return PlaceOrder.placeOrder(filterOptions);
};

export const cancelOrder = async (options: Options): Promise<any> => {
    const filterOptions = { ...options, function: "cancelOrderDYDX()" };
    const validJson: ValidationResult = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) return validJson;
    return CancelOrder.cancelOrder(filterOptions);
};

export const transfer = async (options: Options): Promise<any> => {
    const filterOptions = { ...options, function: "transferDYDX()" };
    const validJson: ValidationResult = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) return validJson;
    return Transfer.transfer(filterOptions);
};

export const deposit = async (options: Options): Promise<any> => {
    const filterOptions = { ...options, function: "depositDYDX()" };
    const validJson: ValidationResult = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) return validJson;
    try {
        return Deposit.deposit(filterOptions);
    } catch (err) {
        return err;
    }
};
