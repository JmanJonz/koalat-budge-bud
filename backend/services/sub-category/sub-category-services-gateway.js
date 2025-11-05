import express from "express";
import { createGateTrafficLogger } from "../../utilities/gateway-traffic-logger.js";
import { authorizeExistingUser } from "../../utilities/authorize-existing-user.js";
import { createSubCat, getSubCats } from "./sub-category-services-manager.js";

const subCategoryGateway = express.Router(); // creates an express router instance

// log traffic through this gate
    const userTrafficLogger = createGateTrafficLogger("SubCat");
    subCategoryGateway.use(userTrafficLogger)

// define the serives down below
    subCategoryGateway.post("/create", authorizeExistingUser, createSubCat);

    subCategoryGateway.get("/get-all", authorizeExistingUser, getSubCats);



export default subCategoryGateway; // export this instance of the express router to be used in server.js
