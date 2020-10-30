const gcalConfig = require("../config/gCalConfig.json");
const calendarEvent = require("../schema/celandarSchema.json");
module.exports.mapper = (payload) => {
  let finalResp = [];

  let config = gcalConfig;
  for (let i = 0; i < payload.length; i++) {
    finalResp.push(iterate(payload[i], ""));
  }

  function iterate(obj, stack) {
    let newResp = {};
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
