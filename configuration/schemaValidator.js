// Copyright 2022 The CmLab Authors
// This file is part of the expand Library.

const Ajv = require('ajv');
const ajv = new Ajv( {allErrors: true, strict: true, useDefaults: true} );
const errorMessage = require('./errorMessage.json');

// Import the AJV error messages
require("ajv-errors")(ajv);


// Standard JSON schema for the complete adaptor program
// Including all the functions
const jsonSchema = require('./schema').jsonSchema;

exports.validateInput = async(options) => {
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

    // console.log(options)
    var validate = ajv.compile(jsonSchema);
    var valid = validate(options);
    var error = valid ? null : validate.errors[0].params;

    var response = {};

    response.valid = valid;

    if ( !valid ) {
        response.message = error;
        response.code = errorMessage.error.code.invalidInput;
    } 

    return (response);
}