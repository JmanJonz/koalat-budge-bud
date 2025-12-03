import express from "express";
import { authenticateUser, createUser, getCurrentUserInfo, logoutUser } from "../user/user-services-manager.js"
import { createGateTrafficLogger } from "../../utilities/gateway-traffic-logger.js";
import { authorizeExistingUser } from "../../utilities/authorize-existing-user.js";
const UserGateway = express.Router(); // creates an express router instance

// log traffic through this gate
    const userTrafficLogger = createGateTrafficLogger("User");
    UserGateway.use(userTrafficLogger)

// endpoint gives the frontend important user info for it to use programatically
// since it can't programatically get it from the http only cookie even tho it is right 
// there!!
    UserGateway.get("/current-user-info", authorizeExistingUser, getCurrentUserInfo);

// define the post gate for creating a user
    // when a POST request is made to the path this router is mounted on
    // the 'createUser' function from the handler will be executed. 
        UserGateway.post("/create", createUser);

// through this gate the user will attempt to login and get authenticated in our system
    UserGateway.post("/login", authenticateUser)

// logout user by clearing JWT cookie
    UserGateway.post("/logout", authorizeExistingUser, logoutUser);

// you can add other user-related gateways here (eg router.get by id update etc)

export default UserGateway; // export this instance of the express router to be used in server.js