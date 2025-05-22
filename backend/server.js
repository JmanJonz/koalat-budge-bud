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

    // set port
        const PORT = process.env.PORT || 5000; // use port from .env or default to 5000

// initialize express app
    const server = express();

// server endpoints
    // serve the the frontend ui
        const viteDistPath = path.join(__dirname, "..", "frontend", "dist")
        server.use(express.static(viteDistPath))

// start the server
    server.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
    })