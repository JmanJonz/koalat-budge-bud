// models/Category_Model.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    // name of the category (e.g., "Food", "Salary", "Utilities")
    category_name: {
        type: String,
        required: [true, "Category name is required."],
        trim: true,
        maxlength: [50, "Category name cannot exceed 50 characters."]
    },
    // type of transaction this category applies to ("income" or "expense")
    category_type: {
        type: String,
        enum: ["income", "expense"],
        required: [true, "Category type (income/expense) is required."]
    },
    // reference to the User who owns this category (if not in a household)
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false // Now optional
    },
    // reference to the Household this category belongs to (if user is in a household)
    household_id: { // Database/Schema/Table/Entity/Column Name: snake_case
        type: mongoose.Schema.Types.ObjectId,
        ref: "Household",
        required: false // Now optional
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Enforce uniqueness: A category name + type must be unique either per user OR per household.
// This requires a custom validation or a more complex compound index.
// For now, let's create a partial unique index, which is common for this scenario.
// If both user_id and household_id are null, this might cause issues for multiple public categories.
// A common pattern is to ensure EITHER user_id OR household_id is present.
categorySchema.index(
    { category_name: 1, category_type: 1, user_id: 1 },
    { unique: true, partialFilterExpression: { user_id: { $exists: true, $ne: null } } }
);
categorySchema.index(
    { category_name: 1, category_type: 1, household_id: 1 },
    { unique: true, partialFilterExpression: { household_id: { $exists: true, $ne: null } } }
);
// This means:
// 1. A user cannot have two "Food - expense" categories if they are operating individually.
// 2. A household cannot have two "Food - expense" categories if they are operating as a household.
// It implies that you should ensure that for a given category, either user_id OR household_id is populated, but not both.

const CategoryModel = mongoose.model("Category", categorySchema); // Class/Service Name: PascalCase
export default CategoryModel;