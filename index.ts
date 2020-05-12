const {execute} = require("./gql.ts");

module.exports.gql = async (input) => {
  console.log(input);
  const data = await execute(input);
  console.log(data);
  return data;
};
