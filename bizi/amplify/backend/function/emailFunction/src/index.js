/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiBiziGraphQLAPIIdOutput = process.env.API_BIZI_GRAPHQLAPIIDOUTPUT
var apiBiziGraphQLAPIEndpointOutput = process.env.API_BIZI_GRAPHQLAPIENDPOINTOUTPUT

Amplify Params - DO NOT EDIT */

var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-east-1" });
exports.handler = async function (event) {
    var recipientEmail = event.arguments.recipientEmail;
    var subject = event.arguments.subject;
    var body = event.arguments.body;
    var params = {
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Message: {
      Body: {
        Text: { Data: body },
      },

      Subject: { Data: subject },
    },
    Source: "thebiziteam@gmail.com",
  };
 
  return ses.sendEmail(params).promise();
};
