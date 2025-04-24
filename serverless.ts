/**
 * In place of "serverless.yml" file we are using "serverless.ts" file because we are using typescript language in
 * our entire project but ".yml" extension uses YAML language to define the structure of the Serverless configuration object.
 * To maintain consistency, we are using "serverless.ts" file which uses TypeScript language to define the structure of the
 * Serverless configuration object.
 *
 * To use "serverless.ts" file instead of "serverless.yml" file, we must install below dependencies in devDependencies using the following command:
 * `npm install -D @serverless/typescript ts-node`
 */

/**
 * Imports the `AWS` type from the `@serverless/typescript` package.
 * This type is used to define the structure of the Serverless configuration object.
 * It helps with TypeScript type checking and ensures that the configuration adheres to the expected format.
 */
import type { AWS } from "@serverless/typescript";

// Import dotenv
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Serverless configuration for the "worko-dashboard-api" service.
 * This configuration includes provider settings, plugins, package options, and function definitions.
 *
 * @type {AWS}
 */
const serverlessConfiguration: AWS = {
  service: "worko-dashboard-api", // Name of the service

  frameworkVersion: "^3.40.0",

  build: {
    esbuild: false,
  },

  package: {
    excludeDevDependencies: true,
  },

  /**
   * Plugins used in the Serverless configuration to enhance the build and deployment process.
   */
  plugins: [
    "serverless-offline", // Enables local testing of the APIs
    "serverless-webpack", // Optimizes the build process using Webpack for packaging Lambda functions.
  ],

  custom: {
    aws: {
      APP_AWS_ACCOUNT_ID: process.env.APP_AWS_ACCOUNT_ID,
      APP_AWS_SECURITY_GROUP: process.env.APP_AWS_SECURITY_GROUP,
      APP_AWS_SUBNET1: process.env.APP_AWS_SUBNET1,
      APP_AWS_SUBNET2: process.env.APP_AWS_SUBNET2,
      APP_SLS_REGION: process.env.APP_SLS_REGION,
    },
  },

  provider: {
    name: "aws",

    /**
     * @Note: 'provider.runtime': must be equal to one of the allowed values [dotnet6, go1.x, java21, java17, java11, java8, java8.al2, nodejs14.x, 
     * nodejs16.x, nodejs18.x, nodejs20.x, provided, provided.al2, provided.al2023, python3.7, python3.8, python3.9, python3.10, python3.11, 
     * ruby2.7, ruby3.2]
     */
    runtime: "nodejs18.x",

    stage: process.env.APP_SLS_STAGE,

    /**
     * region
     *
     * The type of `region` is a string literal type,so that's why we are not assigning dynamic value.
     *
     * @type {"ap-south-1" | "us-east-1" | "us-east-2" | "us-gov-east-1" | "us-gov-west-1" | "us-iso-east-1" | "us-iso-west-1" | "us-isob-east-1" | "us-west-1" | "us-west-2" | "af-south-1" | ... 24 more ... | undefined}
     */
    region: "ap-south-1",

    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:DescribeTable",
          "dynamodb:Query",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
        ],
        Resource: [
          /**
           * arn:aws:dynamodb:{region}:{account-id}:table/{tablename}
           */

          "arn:aws:dynamodb:${self:custom.aws.APP_SLS_REGION}:*:table/worko",
          "arn:aws:dynamodb:${self:custom.aws.APP_SLS_REGION}:*:table/worko/index/GSI1",
          "arn:aws:dynamodb:${self:custom.aws.APP_SLS_REGION}:*:table/worko/index/GSI2",

          "arn:aws:dynamodb:${self:custom.aws.APP_SLS_REGION}:*:table/worko-job-app",
          "arn:aws:dynamodb:${self:custom.aws.APP_SLS_REGION}:*:table/worko-job-app/index/GSI1",
          "arn:aws:dynamodb:${self:custom.aws.APP_SLS_REGION}:*:table/worko-job-app/index/GSI2",
        ],
      },

      {
        Effect: "Allow",
        Action: [
          "ses:SendEmail",
          "ses:GetContactList",
          "ses:SendCustomVerificationEmail",
          "ses:UpdateContactList",
          "ses:UpdateEmailTemplate",
          "ses:GetEmailIdentityPolicies",
          "ses:GetEmailTemplate",
          "ses:CreateEmailTemplate",
          "ses:SendBulkEmail",
          "ses:GetEmailIdentity",
          "ses:CreateTemplate",
          "ses:UpdateTemplate",
          "ses:GetTemplate",
          "ses:DeleteTemplate",
          "ses:SendTemplatedEmail",
          "ses:CreateTemplate",
        ],
        Resource: "*",
      },
    ],
  },

  /**
   * AWS Lambda Functions
   *
   * @see https://www.serverless.com/framework/docs/providers/aws/guide/functions#aws-lambda-functions
   */
  functions: {
    /**
     * workoDashboardApi
     *
     * AWS Function Format:- {service}-{enviroment}-{lambdaName}
     * Ex:
     *  1. `worko-dashboard-api-local-workoJobApp`
     *  2. `worko-dashboard-api-dev-workoJobApp`
     *  3. `worko-dashboard-api-prod-workoJobApp`
     */
    workoDashboardApi: {
      handler: "dist/src/app.handler",
      timeout: 900, // Set timeout to 900 seconds (15 minutes)
      vpc: {
        securityGroupIds: ["${self:custom.aws.APP_AWS_SECURITY_GROUP}"],
        subnetIds: [
          "${self:custom.aws.APP_AWS_SUBNET1}",
          "${self:custom.aws.APP_AWS_SUBNET2}",
        ],
      },

      /**
       * events: REST (API Gateway v1)
       *
       * HTTP Endpoint with Extended Options
       *  @see https://www.serverless.com/framework/docs/providers/aws/events/apigateway#http-endpoint-with-extended-options
       *
       * Enabling CORS
       *  @see https://www.serverless.com/framework/docs/providers/aws/events/apigateway#enabling-cors
       *
       * HTTP Endpoints with Custom Authorizers
       *  @see https://www.serverless.com/framework/docs/providers/aws/events/apigateway#http-endpoints-with-custom-authorizers
       */
      events: [
        {
          http: {
            path: "/{proxy+}",
            method: "ANY",
            cors: {
              origin: "*",
              headers: [
                "Content-Type",
                "X-Amz-Date",
                "Authorization",
                "X-Api-Key",
                "X-Amz-Security-Token",
                "X-Amz-User-Agent",
                "X-Amzn-Trace-Id",
              ],
              allowCredentials: false,
            },
            authorizer: {
              type: "request",
              arn: "arn:aws:lambda:${self:custom.aws.APP_SLS_REGION}:${self:custom.aws.APP_AWS_ACCOUNT_ID}:function:worko-auth",
            },
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
