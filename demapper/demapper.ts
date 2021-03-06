const _ = require("lodash");
const joiOptions = {
    allowUnknown: true,
    abortEarly: false
  };
const DataObjectParser = require("dataobject-parser");

module.exports.demapper = (payload, config, schema) => {
    let finalResp = [];
    if (!payload || payload.length === 0) {
        return {
            "error": true,
            "message": "Payload is required"
        }
    }
    if (!config) {
        return {
            "error": true,
            "message": "Config is required"
        }
    }

    for (let i = 0; i < payload.length; i++) {
        /** Joi validation */
        const { error } = schema.validate(payload[i],joiOptions);
        const errors = [];
        if (error) { 
            error.details.forEach((error) => {
                errors.push(error.message);
            });
        }
        /** If there is any error in Joi validation return the error */
        if (errors && errors.length > 0){
            const unifiedErrorMessage = errors.join(' and ');
            return {
                "error":true,
                "message": unifiedErrorMessage
            }
        }
        payload[i] = {
            ...payload[i], ...payload[i].customFields
        };
        delete payload[i].customFields;
        let flat = DataObjectParser.untranspose(payload[i])
        let result = deMap(flat);
        let structured = DataObjectParser.transpose(result);
        finalResp.push(structured._data);
    }

    function deMap(payload) {
        let resp = payload;
        console.log(payload)
        for (let [configKey, configValue] of Object.entries(config)) {
            if ( _.has(payload, configValue.targetField)) {
                resp[configKey] = payload[configValue.targetField];
                delete resp[configValue.targetField];
            }
        }
        return resp;
    }
    return {
        "error": false,
        "message": "success",
        "data": finalResp
    };
}