import express from "express";
import { authenticateUser, createUser } from "../handlers/user-handler.js";

const router = express.Router(); // creates an express router instance

// define the post gate for creating a user
    // when a POST request is made to the path this router is mounted on
    // the 'createUser' function from the handler will be executed. 
        router.post("/", createUser);

// through this gate the user will attempt to login and get authenticated in our system
    router.post("/login", authenticateUser)

// you can add other user-related gates here (eg router.get by id update etc)

export default router; // export this instance of the express router to be used in server.js