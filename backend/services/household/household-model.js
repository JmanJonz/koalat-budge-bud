import mongoose from "mongoose";

const householdSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 75
    },
    owner: { // the person who creates a household
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }],
    invite_code: { // unique household identifier used to join a household
        type: String,
        unique: true,
        sparse: true // allows multiple documents to have null or missing invite codes
    }

}, {
    timestamps: true
});

const HouseholdModel = mongoose.model("households", householdSchema);
export default HouseholdModel;