const {execute} = require("./gql.ts");
const {mapper} = require('./mapper/mapper.ts')

module.exports.gql = async (input) => {
  const data = await execute(input);
  return data;
};

module.exports.mapper = ({payload,schemaName})=>{
  return mapper(payload,schemaName);
}

