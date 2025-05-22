import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import path from "path";
import { fileURLToPath } from "url"; 

// environment and path setup
    dotenv.config(); // load environment variables from the .env file

    // __dirname equivalent for es modules
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

// databse connection
    import connectDB from "./config/db.js" // note the .js extension for local imports

    // connect to mongoDB
        connectDB();

// initialize express app
    const server = express();

// middleware for parsing json and urlencodeddata
    server.use(express.json()); // allows parsing of json request bodies
    server.use(express.urlencoded({extended:false})); // allows parsing of urlencoded

// api routes
    import userRoutes from './routes/userRoutes.js';
    import expenseRoutes from './routes/expenseRoutes.js';

    // here are your endpoints that also use the .use middleware
        server.use("/api/users", userRoutes); 
        server.use("/api/expenses") // add more routes as your app grows. 
// serve frontend dynamic to environment
    // will serve it in production
        if (process.env.NODE_ENV === "production") {
            // set static folder - points to the "build" folder created by react 
            //-- from my memory this means that you need to buildd your react app and it will translate your whole app insto simple js css and html files to serve
                server.use(express.static(path.resolve(__dirname, "../frontend", "build", "index.html")));

            // for any request that's not an API route, serve the react app's index.html
                server.get("*", (req, res) => {
                    res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
                });
        } else {
            // optional : during dev, you might want a simple message
                server.get("/", (req, res) => res.send("API is running in dev mode!"));
        }

// basic error handling (optional, but recommended)
    server.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send("Something broke!");
    })

// start the server
    const PORT = process.env.PORT || 5000; // use port from .env or default to 5000

    server.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
    })