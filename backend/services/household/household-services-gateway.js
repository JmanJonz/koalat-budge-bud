import express from "express";
import { authorizeExistingUser } from "../../utilities/authorize-existing-user.js"
import { createHousehold, joinHousehold, leaveHousehold, getHouseholdInfo } from "../household/household-services-manager.js";
const HouseholdGateway = express.Router();

HouseholdGateway.post("/create", authorizeExistingUser, createHousehold);
HouseholdGateway.post("/join", authorizeExistingUser, joinHousehold);
HouseholdGateway.post("/leave", authorizeExistingUser, leaveHousehold);
HouseholdGateway.get("/info", authorizeExistingUser, getHouseholdInfo);

export default HouseholdGateway;