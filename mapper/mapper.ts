const gcalConfig = require("../config/gCalConfig.json");
const calendarEvent = require("../schema/celandarSchema.json");

// mappper for all configs 
const configMapper ={
  calendar:gcalConfig,
}
//mappper for all schemas
const schemaMapper ={
  calendar:calendarEvent
}
const _ = require("lodash")
module.exports.mapper = (payload,schemaName) => {
  console.log(schemaName)
  let newResp 
  let finalResp = [];
  //map appropriate config based on name
  let config = configMapper[schemaName];
  for (let i = 0; i < payload.length; i++) {
    // map appropriate schema based on name
    newResp = _.cloneDeep(schemaMapper[schemaName])
    finalResp.push(iterate(payload[i], ""));
  }

  function iterate(obj, stack) {
    for (let property in obj) {
      if (typeof obj[property] == "object") {
        iterate(obj[property], stack + "." + property);
      } else {
        let key = stack + "." + property;
        key = key.replace(".", "");
        if (config[key] !== undefined && config[key].targetField && schemaMapper[schemaName][config[key].targetField]) {
          newResp[config[key].targetField] = obj[property];
        } else {
          newResp[key] = obj[key];
        }
      }
    }
    return newResp;
  }
  for (let i = 0; i < finalResp.length; i++) {
    for (let [key, value] of Object.entries(finalResp[i])) {
      if (value !== undefined && (value === "string" || value === "number" || value === "datetime" || value === "boolean")) {
        finalResp[i][key] = null;
      }
    }
  }

  return finalResp;
};
