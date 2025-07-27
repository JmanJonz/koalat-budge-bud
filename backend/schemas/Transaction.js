import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema({
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },
    amount: {
        type: Number, 
        required: true,
        min: 0.01
    },
    category: {
        type: String,
        required: true
    },
    sub_category: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        trim: true,
        maxLength: [500, "Notes cannot exceed 500 characters."],
        required: false
    },
    // relationship references
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }, {
    // give it a created at and updated at timestamp
        timestamps: true
    }
        
);

// create the model for the schema
    const Transaction = mongoose.model('Transaction', transactionSchema);

// export the model not the schema
    export default Transaction;