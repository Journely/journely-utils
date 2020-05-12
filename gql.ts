const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = "http://127.0.0.1:20002/graphql";
const region = "us-east-1";
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const {GraphQLClient} = require("graphql-request");

module.exports.execute = async function execute() {
  return {data: "test"};
};
