import express from "express";
import { authorizeExistingUser } from "../../utilities/authorize-existing-user.js"
import { createHousehold } from "../household/household-services-manager.js";
const HouseholdGateway = express.Router(); // creates an express router instance

// define the post gate for creating a Transaction
    // when a POST request is made to the path this router is mounted on
    // the 'createTransaction' function from the handler will be executed. 
        HouseholdGateway.post("/create", authorizeExistingUser, createHousehold);

// you can add other Transaction-related gateways here (eg router.get by id update etc)

export default HouseholdGateway; // export this instance of the express router to be used in server.js