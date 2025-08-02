import express from "express";
import { createTransaction } from "../handlers/transaction-handler.js";

const TransactionGate = express.Router(); // creates an express router instance

// define the post gate for creating a Transaction
    // when a POST request is made to the path this router is mounted on
    // the 'createTransaction' function from the handler will be executed. 
        TransactionGate.post("/", createTransaction);

// you can add other Transaction-related gates here (eg router.get by id update etc)

export default TransactionGate; // export this instance of the express router to be used in server.js