import express from "express";
import { authenticateUser, createUser } from "../handlers/user-handler.js";
import { createGateTrafficLogger } from "../middleware-utilities/gate-traffic-logger.js";
const UserGate = express.Router(); // creates an express router instance

// log traffic through this gate
    const userTrafficLogger = createGateTrafficLogger("User");
    UserGate.use(userTrafficLogger)


// define the post gate for creating a user
    // when a POST request is made to the path this router is mounted on
    // the 'createUser' function from the handler will be executed. 
        UserGate.post("/create", createUser);

// through this gate the user will attempt to login and get authenticated in our system
    UserGate.post("/login", authenticateUser)

// you can add other user-related gates here (eg router.get by id update etc)

export default UserGate; // export this instance of the express router to be used in server.js