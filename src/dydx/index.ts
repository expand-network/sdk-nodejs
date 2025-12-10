import * as CancelOrder from './cancelOrder';
import * as Deposit from './deposit';
import * as PlaceOrder from './placeOrder';
import * as Transfer from './transfer';
import * as UserOnboarding from './userOnboarding';
import * as schemaValidator from '../../configuration/schemaValidator';


interface BaseOptions {
    [key: string]: any;
}


interface UserOnboardingOptions extends BaseOptions {
    privateKey: string;
}


interface PlaceOrderOptions extends BaseOptions {
    subAccountNumber: number;
    mnemonic: string;
    market: string;
    type: string; 
    side: string; 
    timeInForce: string; 
    time: number;
    price: number;
    postOnly: boolean;
    reduceOnly: boolean;
    triggerPrice?: number;
    size: number;
}


interface CancelOrderOptions extends BaseOptions {
    subAccountNumber: number;
    mnemonic: string;
    orderId: string;
    goodTillTimeInSeconds: string;
}


interface TransferOptions extends BaseOptions {
    subAccountNumber: number;
    mnemonic: string;
    recipient: string;
    assetId: number;
    amount: string | number;
}


interface DepositOptions extends BaseOptions {
    srcChainId: number;
    from: string;
    to: string;
    amountIn: string;
    tokenIn: string;
    slippage: number;
    gas: number;
    privateKey: string;
}

interface ValidationResult {
    valid: boolean;
    errors?: string[];
    [key: string]: any;
}

export const userOnboarding = async (options: UserOnboardingOptions): Promise<any> => {
    const filterOptions = { ...options, function: "userOnboardingDYDX()" };
    const validJson: ValidationResult = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) return validJson;
    return UserOnboarding.userOnboarding(options);
};

export const placeOrder = async (options: PlaceOrderOptions): Promise<any> => {
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
   
    return PlaceOrder.placeOrder(filterOptions as any);
};

export const cancelOrder = async (options: CancelOrderOptions): Promise<any> => {
    const filterOptions = { ...options, function: "cancelOrderDYDX()" };
    const validJson: ValidationResult = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) return validJson;
    return CancelOrder.cancelOrder(filterOptions);
};

export const transfer = async (options: TransferOptions): Promise<any> => {
    const filterOptions = { ...options, function: "transferDYDX()" };
    const validJson: ValidationResult = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) return validJson;
    return Transfer.transfer(filterOptions);
};

export const deposit = async (options: DepositOptions): Promise<any> => {
    const filterOptions = { ...options, function: "depositDYDX()" };
    const validJson: ValidationResult = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) return validJson;
    try {
        return Deposit.deposit(filterOptions);
    } catch (err) {
        return err;
    }
};
