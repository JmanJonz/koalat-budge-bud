import express from "express";
import { createTransaction, getTransactions, updateTransaction, deleteTransaction, getTransactionSummary } from "./transaction-services-manager.js";
import { authorizeExistingUser } from "../../utilities/authorize-existing-user.js";

const TransactionGateway = express.Router(); // creates an express router instance

// Create a new transaction
TransactionGateway.post("/create", authorizeExistingUser, createTransaction);

// Get all transactions with optional filters
TransactionGateway.get("/get-all", authorizeExistingUser, getTransactions);

// Get transaction summary/analytics
TransactionGateway.get("/summary", authorizeExistingUser, getTransactionSummary);

// Update a transaction by ID
TransactionGateway.put("/update/:id", authorizeExistingUser, updateTransaction);

// Delete a transaction by ID
TransactionGateway.delete("/delete/:id", authorizeExistingUser, deleteTransaction);

export default TransactionGateway; // export this instance of the express router to be used in server.js