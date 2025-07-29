import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    transaction_type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },
    user_
})