import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema({
    amount: {
        type: Number, 
        required: true,
        min: 0.01
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Refers to the new Category model
        required: [true, "A primary category is required for the transaction."]
    },
    sub_category_id: { // Database/Schema/Table/Entity/Column Name: snake_case
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory", // Refers to the new SubCategory model
        required: [true, "A sub-category is required for the transaction."]
    },
    notes: {
        type: String,
        trim: true,
        maxLength: [500, "Notes cannot exceed 500 characters."],
        required: false
    },
    // relationship references
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        household_id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Household", // refers to your Household_Model
            required: false // I think I may want to change this later so that if you join a household you have to be tracked on it? idk rn
        }
    }, {
    // give it a created at and updated at timestamp
        timestamps: true
    }
        
);

// create the model for the schema
    const TransactionModel = mongoose.model('Transaction', transactionSchema);

// export the model not the schema
    export default TransactionModel;