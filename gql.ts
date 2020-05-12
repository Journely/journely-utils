const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_JOURNELYV2GQL_GRAPHQLAPIENDPOINTOUTPUT;
const region = "us-east-1";
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const {GraphQLClient} = require("graphql-request");

module.exports.execute = async function execute({request, operationName, action, input}) {
  const req = new AWS.HttpRequest(appsyncUrl, region);

  req.method = "POST";
  req.headers.host = endpoint;
  req.headers["Content-Type"] = "application/json";
  req.body = JSON.stringify({
    query: action,
    operationName: operationName,
    variables: input,
  });

  if (request && request.headers && !!request.headers["x-api-key"]) {
    req.headers["x-api-key"] = request.headers["x-api-key"];
  } else if (request && request.headers && request.headers.authorization && request.headers.authorization !== "") {
    req.headers["authorization"] = request.headers.authorization;
  } else {
    const signer = new AWS.Signers.V4(req, "appsync", true);
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
  }

  const client = new GraphQLClient(appsyncUrl, req);
  const data = await client.request().catch((err) => console.log(JSON.stringify(err)));

  return data;
};
