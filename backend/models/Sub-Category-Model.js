// models/Sub_Category_Model.js
import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    // name of the sub-category (e.g., "Groceries", "Restaurants" for "Food")
    sub_category_name: {
        type: String,
        required: [true, "SubCategory name is required."],
        trim: true,
        maxlength: [50, "SubCategory name cannot exceed 50 characters."]
    },
    // reference to its parent Category
    parent_category_id: { // Database/Schema/Table/Entity/Column Name: snake_case
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "SubCategory must belong to a parent category."]
    },
    // reference to the User who owns this sub-category (if not in a household)
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false // Now optional
    },
    // reference to the Household this sub-category belongs to (if user is in a household)
    household_id: { // Database/Schema/Table/Entity/Column Name: snake_case
        type: mongoose.Schema.Types.ObjectId,
        ref: "Household",
        required: false // Now optional
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Enforce uniqueness for sub-categories similar to categories.
subCategorySchema.index(
    { sub_category_name: 1, parent_category_id: 1, user_id: 1 },
    { unique: true, partialFilterExpression: { user_id: { $exists: true, $ne: null } } }
);
subCategorySchema.index(
    { sub_category_name: 1, parent_category_id: 1, household_id: 1 },
    { unique: true, partialFilterExpression: { household_id: { $exists: true, $ne: null } } }
);

const SubCategoryModel = mongoose.model("SubCategory", subCategorySchema); // Class/Service Name: PascalCase
export default SubCategoryModel;