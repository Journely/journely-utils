const _ = require("lodash");
const axios = require('axios');
const DataObjectParser = require("dataobject-parser");
const dataTypes = ["string", "datetime", "boolean", "number", "array", "object"];
const schemaManifest = require("../schema/schema.manifest.json");
module.exports.mapper = async (payload, config, schemaType) => {
    let resp;
    let finalResp = [];
    if(!schemaType){
      return {
          "error": true,
          "message": "Schema type is required"
      }
    }
    let schemaDetails = schemaManifest[schemaType];
    let schema = null;
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
    if(schemaDetails && schemaDetails.schemaUrl){
        console.time("getSchemaFromS3");
        const res = await axios.get(schemaDetails.schemaUrl);
        if(res.data){
            schema = res.data;
        }
        console.timeEnd("getSchemaFromS3");
    }
    if (!schema) {
        return {
            "error": true,
            "message": "Schemma is required"
        }
    }
    schema.customFields = {};
    for (let i = 0; i < payload.length; i++) {
        resp = _.cloneDeep(schema);
        let result = iterate(payload[i], "");
        for (let [key, value] of Object.entries(result)) {
          if (value !== undefined && typeof value === 'string' && dataTypes.indexOf(value.toLowerCase().trim()) !== -1) {
            result[key] = null;
          }
        }
        let structured = DataObjectParser.transpose(result);
        finalResp.push(structured._data);
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
                    resp.customFields[key] = obj[key];
                    //resp[key] = obj[key];
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