// Copyright 2022 The CmLab Authors
// This file is part of the expand Library.

import Ajv from "ajv";
import addErrors from "ajv-errors";
import errorMessage from "./errorMessage.json";
import { jsonSchema } from "./schema";

const ajv = new Ajv({ allErrors: true, strict: true, useDefaults: true });
addErrors(ajv);

export const validateInput = async(options:any) => {
    /*
     * This functions validate the given options as per the schema
     * Returns the validate response as of following
     * 
     * {
     *    "valid": false,
     *    "message" : {
     *       "error": {
     *          missingProperty: 'address' 
     *      }
     *    }
     *    "code" : 401
     * }    
     */

    const validate = ajv.compile(jsonSchema);
    const valid = validate(options);
    const error = valid ? null : (validate.errors && validate.errors[0]?.params);
    const response: any = {};
         response.valid = valid;

         if (!valid) {
            response.message = error || { error: "Unknown validation error" };
            response.code = errorMessage.error.code.invalidInput;
          }

    return (response);
};