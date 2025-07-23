import express from "express";
import { createUser } from "../handlers/userHandler.js";

const router = express.Router(); // creates an express router instance

// define the post gate for creating a user
    // when a POST request is made to the path this router is mounted on
    // the 'createUser' function from the handler will be executed. 
        router.post("/", createUser);

// you can add other user-related gates here (eg router.get by id update etc)

export default router; // export this instance of the express router to be used in server.js