/**
 * APP_CONSTANTS
 *
 * These are the generic constants common for all applications/services.
 * For the application/service specific constants consider respective constant config file.
 */
const APP_CONSTANTS = {
  // Application default timezone
  APP_DEFAULT_TIMEZONE: process.env.TZ ?? "GMT",

  // Application stage
  APP_SLS_STAGE: process.env.APP_SLS_STAGE,

  // The stages/environments supported by the application.
  STAGES: {
    LOCAL: "local",
    DEV: "dev",
    PROD: "prod",
  },

  /**
   * Date formates
   */
  DATE_FORMAT_BASE_ERROR_TIMESTAMP: "ddd, DD MMM YYYY HH:mm:ss z", // Date format for the "BaseError.timeStamp" class property
  MYSQL_DATE_FORMATE: "YYYY-MM-DD", // MySQL Date formates

  // This is unknow exception error message
  ERROR_MESSAGE_UNKNOWN_EXCEPTION: "Something went wrong!!!",
  ERROR_MESSAGE_REQUEST_FOR_AUTHORISED_RESOURSE_ACCESS: "",
  ERROR_MESSAGE_RESOURCE_NOT_FOUND:
    "The requested resource is not found with the provided details.",

  // The possible options for the page sizes that is expected in the request payload.
  PAGE_LENGTH_OPTIONS: [10, 25, 50, 100, 150, 200, 250],

  // If "pageSize" from the request does not match with one of the "PAGE_LENGTH_OPTIONS" value, then this value would be used.
  PAGE_LENGTH_DEFAULT: 25,

  LAMBDA_FUNCTION_NAMES: {
    /**
     * RESUME_EXTRACTION_LAMBDA_NAME
     *
     * Lambda function name for "Resume Extraction"
     * AWS Lambada Configurations related to triggering "Resume Extraction"
     */
    RESUME_EXTRACTION_LAMBDA_NAME: "resume-parser",

    /**
     * MATCHING_SCORE_LAMBDA_NAME
     *
     * Lambda function name for "Matching Score"
     * AWS Lambada Configurations related to triggering "Matching Score"
     */
    MATCHING_SCORE_LAMBDA_NAME: "worko-jd-resume-matching",

    /**
     * JOB_DESCRIPTION_PARSER_LAMBDA_NAME
     *
     * Lambda function name for "Job Description Parser"
     * AWS Lambada Configurations related to triggering "Job Description Parser"
     */
    JOB_DESCRIPTION_PARSER_LAMBDA_NAME: "worko-job-description-parser",

    /**
     * USER_MATCHING_SCORE_JOB_LAMBDA_NAME
     *
     * Lambda function name for "User Matching Score Job"
     * AWS Lambada Configurations related to triggering "User Matching Score Job"
     */
    USER_MATCHING_SCORE_JOB_LAMBDA_NAME: "worko-user-matching-score-job",
  },

  /**
   * SOURCE_EMAIL_ADDRESS
   *
   * Possible source email addresses & names would be used as sender while sending emails outside the application.
   *
   * Here you may consider adding additional sources for different use cases and use them in the application.
   */
  SOURCE_EMAIL_ADDRESS: {
    WORKO_DEFAULT: {
      email: "hello@worko.ai",
      fullName: "Worko.ai",
    },
    WORKO_NO_REPLY: {
      email: "no-reply@worko.ai",
      fullName: "Worko.ai",
    },
  },
};

export default APP_CONSTANTS;
