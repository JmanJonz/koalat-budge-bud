import express from "express";
import { authenticateUser, createUser } from "../handlers/user-handler.js";

const UserGate = express.Router(); // creates an express router instance

// Middleware to log every request that passes through this gate
// The user will now see this log for every request to /api/users
UserGate.use((req, res, next) => {
	console.log("Request Passed Through User Gate");
	next(); // This is crucial to pass the request to the next handler
});


// define the post gate for creating a user
    // when a POST request is made to the path this router is mounted on
    // the 'createUser' function from the handler will be executed. 
        UserGate.post("/create", createUser);

// through this gate the user will attempt to login and get authenticated in our system
    UserGate.post("/login", authenticateUser)

// you can add other user-related gates here (eg router.get by id update etc)

export default UserGate; // export this instance of the express router to be used in server.js