// Import express packages
import { Request, Response, NextFunction } from "express";

// Import utils
import HttpStatusCode from "../utils/http-codes.util";

/**
 * TestController
 *
 * This class is used to create, read, update, delete and search Tests.
 */
class TestController {
  getAllTestsByFilterOptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      global.logger.info(`Test [Controller]`, {
        filePath: __filename,
        methodName: this.getAllTestsByFilterOptions.name,
      });

      // send response with Test details
      res.status(HttpStatusCode.OK_200).json({
         "Test": "Test"
      });
    } catch (error) {
      // Pass the error to Express's default error handler
      next(error);
    }
  };
}

export default TestController;