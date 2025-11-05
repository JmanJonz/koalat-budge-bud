import express from "express";
import { createTransaction } from "./transaction-services-manager.js";
import { authorizeExistingUser } from "../../utilities/authorize-existing-user.js";

const TransactionGateway = express.Router(); // creates an express router instance

// define the post gate for creating a Transaction
    // when a POST request is made to the path this router is mounted on
    // the 'createTransaction' function from the handler will be executed. 
        TransactionGateway.post("/create", authorizeExistingUser, createTransaction);

// you can add other Transaction-related gateways here (eg router.get by id update etc)

export default TransactionGateway; // export this instance of the express router to be used in server.js