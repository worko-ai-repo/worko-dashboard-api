// NPM Packages
import AWS from "aws-sdk";

// Import configs
import APP_CONSTANTS from "./constants.config";

/**
 * awsConfigOptions
 *
 * Generic configurations for the AWS services.
 */
let awsConfigOptions: AWS.ConfigurationOptions = {};

// For the "local" env/stage use the credentials from the environment config,
// and for all other envs/stages the permissions from the lambda function would be used.
if (process.env.APP_STAGE == APP_CONSTANTS.STAGES.LOCAL) {
  awsConfigOptions = {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.APP_AWS_SESSION_TOKEN,
    region: process.env.APP_AWS_REGION,
  };
}

// ****************************************************************************************************
// AWS DynamoDB Client Library
// ****************************************************************************************************

/**
 * awsDynamoDBConfigOptions
 *
 * AWS DynamoDB specific configurations extending the "awsConfigOptions".
 */
const awsDynamoDBConfigOptions: AWS.DynamoDB.ClientConfiguration = {
  ...awsConfigOptions,
};

// Export the required resourses
export {
  // Configurations
  awsConfigOptions,
  awsDynamoDBConfigOptions,
};
