// Copyright 2022 The CmLab Authors
// This file is part of the expand Library.

import Ajv from 'ajv';
import errorMessage from '../configuration/errorMessage';
const ajv = new Ajv( {allErrors: true, strict: true, useDefaults: true} );
import jsonSchema from './schema';

// Import the AJV error messages
require("ajv-errors")(ajv);

export default class SchemaValidator {

// Standard JSON schema for the complete adaptor program
// Including all the functions


validateInput = async(options) => {
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
    const error = valid ? null : validate.errors[0].params;
    let response = {
        message : null,
        valid: null,
        code : null,
        error : null
    }

    response.valid = valid;

    if ( !valid ) {
        response.message = error;
        response.code = errorMessage.code.invalidInput;
    } 

    return (response);
};
}