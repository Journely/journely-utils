const {execute} = require("./gql.ts");
const {mapper} = require('./mapper/mapper.ts');
const {demapper} = require('./demapper/demapper.ts');

module.exports.gql = async (input) => {
  const data = await execute(input);
  return data;
};

module.exports.mapper = (payload, config, schema)=>{
  return mapper(payload, config, schema);
};

module.exports.demapper = (payload, config)=>{
  return mapper(payload, config);
};