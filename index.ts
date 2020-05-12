const {execute} = require("./gql.ts");

module.exports.gql = async (input) => {
  const data = await execute(input);
  return data;
};
