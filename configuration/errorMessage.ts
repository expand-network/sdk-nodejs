interface ErrorMessages {
    invalidInput: string;
    notApplicable: string;
    invalidChainId: string;
    invalidDexId: string;
    invalidLendBorrowId: string;
    invalidYieldAggregatorId: string;
    invalidSrcToken: string;
    invalidOrderId: string;
}

interface ErrorCodes {
    invalidInput: number;
    notApplicable: number;
}

interface ErrorResponse {
    error: {
        message: ErrorMessages;
        code: ErrorCodes;
    };
}

const errorResponse: ErrorResponse = {
    error: {
        message: {
            invalidInput: "Please provide proper input data",
            notApplicable: "Given function is not applicable",
            invalidChainId: "Invalid chain ID",
            invalidDexId: "Invalid Dex Id",
            invalidLendBorrowId: "Invalid Lend Borrow Id",
            invalidYieldAggregatorId: "Invalid Yield Aggregator Id",
            invalidSrcToken: "Invalid/Unsupported Src Token",
            invalidOrderId: "Invalid Order Id"
        },
        code: {
            invalidInput: 400,
            notApplicable: 406
        }
    }
};

export default errorResponse;