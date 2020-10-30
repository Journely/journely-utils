const gcalConfig = require("../config/gCalConfig.json");
const calendarEvent = require("../schema/celandarSchema.json");
const _ = require("lodash")
module.exports.mapper = (payload) => {
  let finalResp = [];
  let config = gcalConfig;
  let newResp 
  for (let i = 0; i < payload.length; i++) {
    newResp = _.cloneDeep(calendarEvent)
    finalResp.push(iterate(payload[i], ""));
  }

  function iterate(obj, stack) {
    for (let property in obj) {
      if (typeof obj[property] == "object") {
        iterate(obj[property], stack + "." + property);
      } else {
        let key = stack + "." + property;
        key = key.replace(".", "");
        if (config[key] !== undefined && config[key].targetField && calendarEvent[config[key].targetField]) {
          newResp[config[key].targetField] = obj[property];
        } else {
          newResp[key] = obj[key];
        }
      }
    }
    return newResp;
  }

  return finalResp;
};
