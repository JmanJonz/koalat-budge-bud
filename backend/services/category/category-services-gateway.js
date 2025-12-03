import express from "express";
import { authorizeExistingUser } from "../../utilities/authorize-existing-user.js";
import { createCategory, getCategories, deleteCategory } from "./category-services-manager.js";
const CategoryGateway = express.Router(); // creates an express router instance

// define the post gate for creating a Transaction
    // when a POST request is made to the path this router is mounted on
    // the 'createTransaction' function from the handler will be executed. 
        CategoryGateway.post("/create", authorizeExistingUser, createCategory);

// get all the categories tied to a householdId
    CategoryGateway.get("/get-cats", authorizeExistingUser, getCategories)

// delete a category by ID
    CategoryGateway.delete("/delete/:id", authorizeExistingUser, deleteCategory);

// you can add other Transaction-related gateways here (eg router.get by id update etc)

export default CategoryGateway; // export this instance of the express router to be used in server.js