const _ = require("lodash")

module.exports.mapper = (payload, config, schema) => {
    let resp;
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
    if (!schema) {
        return {
            "error": true,
            "message": "Schemma is required"
        }
    }
    for (let i = 0; i < payload.length; i++) {
        resp = _.cloneDeep(schema);
        let result = iterate(payload[i], "");
        for (let [key, value] of Object.entries(result)) {
            if (value !== undefined && (value === "string" || value === "number" || value === "datetime" || value === "boolean") || value === "array" || value === "object") {
                result[key] = null;
            }
        }
        finalResp.push(result);
    }

    function iterate(obj, stack) {
        for (let property in obj) {
            if (!Array.isArray(obj[property]) && typeof obj[property] == "object") {
                iterate(obj[property], stack + "." + property);
            } else {
                let key = stack + "." + property;
                key = key.replace(".", "");
                if (config[key] !== undefined && config[key].targetField && schema[config[key].targetField]) {
                    resp[config[key].targetField] = obj[property];
                } else {
                    resp[key] = obj[key];
                }
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