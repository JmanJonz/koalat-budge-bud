
import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./config/mongo_db.js";
import cors from "cors"
import colors from "colors";
import path from "path";
import { fileURLToPath } from "url"; 
import UserGateway from "./services/user/user-services-gateway.js";
import TransactionGateway from "./services/transaction/transaction-services-gateway.js";
import { reqBodyLogger } from "./utilities/req-body-logger.js";
import HouseholdGateway from "./services/household/household-services-gateway.js";
import CategoryGateway from "./services/category/category-services-gateway.js";
import subCategoryGateway from "./services/sub-category/sub-category-services-gateway.js";

// environment and path setupppp
// this is important becasue the database function below will use these variables...
    dotenv.config(); // load environment variables from the .env file

// connect to the database with imported function that I coded
    connectMongoDB();

    // __dirname equivalent for es modules
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

    // set port
        const PORT = process.env.PORT || 5000; // use port from .env or default to 5000

// initialize express app
    const server = express();

// Middleware! 
    // CORS (Cross-Origin Resource Sharing) Middleware
    // !!! Important in production only allow access to server from my clients
        server.use(cors({
            origin: [
                "http://localhost:5173",
                "https://budgebud.koalattech.app"
            ],
            credentials: true
        }));

    // this middleware is also crucial and caused me major problems when I didn't have it!!!
        server.use(cookieParser()) // need to add the () or else the request stays here forever!
    // this line is crucial!! it turns json body requests into js bojects to work with!
        server.use(express.json());

    // request logging middleware!
        server.use(reqBodyLogger)

    // --- NEW: Request Logging Middleware ---
    // This middleware will log every incoming request's method and URL
    // It should be placed BEFORE your specific gateways (app.use("/api/users", usergateways))
    server.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] Incoming Request: ${req.method} ${req.originalUrl}`);
        next(); // Pass control to the next middleware/route handler
    });
    // --- END NEW Request Logging Middleware ---

    // server gateways
        // gateways to access users in the database
            server.use("/gateways/user", UserGateway);

        // househld gate offers
            server.use("/gateways/household", HouseholdGateway)

        // gateways to access transactions in the database
            server.use("/gateways/transaction", TransactionGateway);

        // gate to access category functinality / data base ops
            server.use("/gateways/category", CategoryGateway)

        // gateway to sub category services
            server.use("/gateways/sub-cats", subCategoryGateway)

        // serve the the frontend ui
            const viteDistPath = path.join(__dirname, "..", "frontend", "dist")
            server.use(express.static(viteDistPath))

// start the server
    server.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
    })