// Load the npm packages
import { Router } from "express";

// Load controllers
import TestController from "../controllers/Test.controller";

// Create instance of the "TestController" class to read the methods/functions from the same.
const testController = new TestController();

// Route to hold the routes (CRUD, etc) related to "Test" index
const TestRouter = Router();

/**
 * Get Test by filter options
 *
 * @authorisedRoles ["public"]
 */
TestRouter.get("/", testController.getAllTestsByFilterOptions);

// Export the "TestRouter" router
export default TestRouter;