const {execute} = require("./gql.ts");

module.exports.gql = (input) => {
  const data = execute(input);
  return data;
};
