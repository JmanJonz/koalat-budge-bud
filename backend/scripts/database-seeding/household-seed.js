// scripts/create-categories-collection.js
import mongoose from "mongoose";
import HouseholdModel from "../../models/Household-Model.js";
import dotenv from "dotenv";
import connectMongoDB from "../../config/mongo_db.js";

// environment and path setupppp
// this is important becasue the database function below will use these variables...
    dotenv.config(); // load environment variables from the .env file

// connect to the database with imported function that I coded
    connectMongoDB();

const createCollectionAndIndexes = async () => {
    try {
        // b. Explicitly create the 'categories' collection and apply its indexes
        // The collection name will be the pluralized, lowercase version of your model name ("Category" -> "categories")
        // as per Mongoose's default behavior, and in line with your snake_case rule.
        await HouseholdModel.createCollection();
        console.log("Collection 'categories' created/ensured and indexes applied successfully!");

    } catch (error) {
        // c. Catch any errors during connection or collection creation
        console.error("Error ensuring 'categories' collection exists:", error);
    } finally {
        // d. Disconnect from the database
        await mongoose.disconnect();
        console.log("MongoDB Disconnected.");
    }
};

// 2. Run the function
createCollectionAndIndexes();