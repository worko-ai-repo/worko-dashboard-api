
```ts
// Importing necessary packages/modules from npm
import { Item } from "dynamoose/dist/Item";

// Represents the base structure for the database DTO (Data Transfer Object)
class BaseDbDto extends Item {
  "PK": string;
  "SK": string;
  "timestamps": {
    createdAt: string; // Dynamoose will handle this field
    updatedAt: string; // Dynamoose will handle this field
  };
}

// Exports the necessary elements to be used externally
export { BaseDbDto };
```

# Marketing dashboard ddb:
  ## Dashboard User LoggedIn Activities:
    ```ts
    modelName = "DashboardUserLoggedInActivity";
    partitianKey = "USR#EML#{primaryEmail}";
    sortKey = `DASH#LOGIN#ACT#ID#{id}`;
    GSI1PK = "DASH#LOGIN#ACT#ID#{id}"; 
    GSI1SK = "ID#{id}";
    ```

  ## Dashboard User Job Applications:
    ```ts
    modelName = "DashboardUserJobApplication";
    partitianKey = "USR#EML#{primaryEmail}";
    sortKey = `DASH#JOB#APP#ID#{id}`;
    GSI1PK = "DASH#JOB#APP#"; 
    GSI1SK = "ID#{id}";
    ```
    ```ts
    class DbDashboardUserJobApplicationDto extends BaseDbDto {
      id!:string;

      /**
      * @reference `id` attribute of `UserDetail.model.ts`
      */
      updatedByUserId?:string;

      applicantDetails!: {
        name: string,
        email: string,

        /**
          * phoneCountryCode
          *
          * @example 91
          */
        phoneCountryCode: number;

        /**
          * phoneNumber
          *
          * @example 9666xxx100
          */
        phoneNumber: number;

        /**
          * store `createdAt` attribute from `UserDetail.model.ts`
          */
        signupDate: string;

        isProfileCompleted: {
          CAND?: boolean,
          EMP?: boolean
        }

        isCvUploaded: boolean;

        lastLoginDate: string;
      };

      loginFrequency: {
        lastSevenDaysCount: number, //  In `7` day period count of how many times he loggedin.
        lastThirtyDaysCount: number, //  In `30` day period count of how many times he loggedin.
        lastSixtyDaysCount: number, //  In `60` day period count of how many times he loggedin.
      };

      internalJobAppliedFrequency: {
        totalCount: number,
        lastSevenDaysCount: number,
        lastThirtyDaysCount: number, 
        lastSixtyDaysCount: number,
      };

      externalJobAppliedFrequency: {
        totalCount: number,
        lastSevenDaysCount: number,
        lastThirtyDaysCount: number, 
        lastSixtyDaysCount: number,
      };

      /*
      count of below:
        CV_DOWNLOADED = "CV_DOWNLOADED",

        UNDER_EVALUATION = "UNDER_EVALUATION",

        PROCESSING_INTERVIEW = "PROCESSING_INTERVIEW",

        INTERVIEW_DONE = "INTERVIEW_DONE",
      */
      internalJobInProgressFrequency: {
        totalCount: number,
      };

      rejectedFrequencyByCorporate: {
        lastSevenDaysCount: number, 
        lastThirtyDaysCount: number, 
      };

      rejectedFrequencyByWorkoAdmin: {
        lastSevenDaysCount: number, 
        lastThirtyDaysCount: number, 
      };

      followUpRequestFrequency: {
        totalCount: number,
      };
    } 
    ```


  ## Dashboard User Referral:
    ```ts
    modelName = "DashboardUserReferral";
    partitianKey = "USR#EML#{primaryEmail}";
    sortKey = `DASH#REF#ID#{reqId}`;
    GSI1PK = "DASH#REF#"; 
    GSI1SK = "ID#{id}";
    ```
    ```ts
    class DbDashboardUserReferralDto extends BaseDbDto {
      id!:string;

      /**
      * @reference `id` attribute of `UserDetail.model.ts`
      */
      updatedByUserId?:string;

      applicantDetails!: {
        name: string,
        email: string,

        /**
          * phoneCountryCode
          *
          * @example 91
          */
        phoneCountryCode: number;

        /**
          * phoneNumber
          *
          * @example 9666xxx100
          */
        phoneNumber: number;

        /**
          * store `createdAt` attribute from `UserDetail.model.ts`
          */
        signupDate: string;

        isProfileCompleted: {
          CAND?: boolean,
          EMP?: boolean
        }

        isCvUploaded: boolean;

        lastLoginDate: string;
      };

      loginFrequency: {
        lastSevenDaysCount: number, //  In `7` day period count of how many times he loggedin.
        lastThirtyDaysCount: number, //  In `30` day period count of how many times he loggedin.
        lastSixtyDaysCount: number, //  In `60` day period count of how many times he loggedin.
      };

      referralRequestFrequency: {
        totalCount: number,
        lastSevenDaysCount: number, 
        lastThirtyDaysCount: number, 
        lastSixtyDaysCount: number,
      };

      acceptedReferralRequestFrequency: {
        lastSevenDaysCount: number, 
        lastThirtyDaysCount: number, 
      };

      rejectedReferralRequestFrequency: {
        lastThirtyDaysCount: number, 
      };

      doneReferralRequestFrequency: {
        totalCount: number,
      };

      // referral count left
      remainingReferralCountFrequency: {
        totalCount: number,
      };

      referralPremiumPlanName: string;
    } 
    ```



  ## Dashboard User Refer and earn:
    ```ts
    modelName = "DashboardUserReferAndEarn";
    partitianKey = "USR#EML#{primaryEmail}";
    sortKey = `DASH#REF#EARN#ID#`;
    GSI1PK = "DASH#REF#EARN#"; 
    GSI1SK = "ID#{id}";
    ```
    ```ts
    class DbDashboardUserReferAndEarnDto extends BaseDbDto {
      id!:string;

      /**
      * @reference `id` attribute of `UserDetail.model.ts`
      */
      updatedByUserId?:string;

      applicantDetails!: {
        name: string,
        email: string,

        /**
          * phoneCountryCode
          *
          * @example 91
          */
        phoneCountryCode: number;

        /**
          * phoneNumber
          *
          * @example 9666xxx100
          */
        phoneNumber: number;

        /**
          * store `createdAt` attribute from `UserDetail.model.ts`
          */
        signupDate: string;

        isProfileCompleted: {
          CAND?: boolean,
          EMP?: boolean
        }

        isCvUploaded: boolean;

        lastLoginDate: string;
      };

      loginFrequency: {
        lastSevenDaysCount: number, //  In `7` day period count of how many times he loggedin.
        lastThirtyDaysCount: number, //  In `30` day period count of how many times he loggedin.
        lastSixtyDaysCount: number, //  In `60` day period count of how many times he loggedin.
      };

      referredFrequency: {
        totalCount: number,
      };
      
      // reference: `UserReferAndEarn.model.ts`
      appliedFrequency: {
        totalCount: number,
      };

      hiringProcessFrequency: {
        totalCount: number,
      };

      rejectedFrequency: {
        totalCount: number,
      };

      hiredFrequency: {
        totalCount: number,
      };

      appliedByReferrerFrequency: {
        totalCount: number,
      };

      referralBonusFrequency: {
        totalBonus: number,
      }
    } 
    ```

  ## Dashboard Corporate LoggedIn Activities:
    ```ts
    modelName = "";
    partitianKey = "";
    sortKey = ``;
    GSI1PK = ""; 
    GSI1SK = "";
    ```

  ## Dashboard Corporate Job Post:
    ```ts
    modelName = "";
    partitianKey = "";
    sortKey = ``;
    GSI1PK = ""; 
    GSI1SK = "";
    ```
