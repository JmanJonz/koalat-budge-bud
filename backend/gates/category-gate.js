import express from "express";
import { authorizeExistingUser } from "../middleware-utilities/authorize-existing-user.js";
import { createCategory, getCategories } from "../handlers/category-handler.js";
const CategoryGate = express.Router(); // creates an express router instance

// define the post gate for creating a Transaction
    // when a POST request is made to the path this router is mounted on
    // the 'createTransaction' function from the handler will be executed. 
        CategoryGate.post("/create", authorizeExistingUser, createCategory);

// get all the categories tied to a householdId
    CategoryGate.get("/get-cats", authorizeExistingUser, getCategories)

// you can add other Transaction-related gates here (eg router.get by id update etc)

export default CategoryGate; // export this instance of the express router to be used in server.js