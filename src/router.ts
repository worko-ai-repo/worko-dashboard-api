// Load the npm packages
import { Router } from "express";

// Import the routes
import TestRouter from "./routers/Test.router";

// Router that contains all the routes/endpoints in the application
const router = Router();

/**
 * AUTHORISATION ROLES DESCRIPTION
 * 
 * Custom Roles
 *    "public" - Any user can access these routes even if they are not logged in
 *    "loggedInUser" - Only logged in users can access these routes
 * 
 * Cognito User Groups
 *    "admin" - Only worko admin users can access these routes
 *    "corporate-recruiter" - Only corporate recruiters can access these routes
 *    "corporate-admin" - Only corporate admin users can access these routes
 */

/**
 * TEST ROUTERS
 * 
 * Regitser the "TEST CRUD" routers
 * 
 * @todo: Need to remove this entire route related piece of code befor pushing code to `dev` branch
 * 
 * @authorisedRoles ["public"]
 */
router.use("/test", TestRouter);

export default router;