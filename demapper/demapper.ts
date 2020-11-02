const _ = require("lodash")
const DataObjectParser = require("dataobject-parser");
module.exports.demapper = (payload, config) => {
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
        let result = deMap(payload[i]);
        finalResp.push(result);
    }

    function deMap(payload) {
        let resp = {};
        for (let [configKey, configValue] of Object.entries(config)) {
            if (payload[configValue.targetField] || payload[configValue.targetField] === null) {
                if (configKey.indexOf(".") !== -1) {
                    let d = new DataObjectParser();
                    d.set(configKey, payload[configValue.targetField]);
                    let obj = d.data();
                    resp = Object.assign(resp, obj);
                } else {
                    resp[configKey] = payload[configValue.targetField];
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