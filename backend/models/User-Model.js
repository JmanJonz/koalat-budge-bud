import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true, // every user must have this. 
            unique: true, // every user name has to be a unique identity
            trim: true, // trims off leading or trailing white space
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true, // you may want to add regex validation here later
        },
        password: {
            type: String,
            required: true,
            minlength: 10, // a good idea for basic validation here even if not hashed yet
        },
        tier: {
            type: String,
            enum: ["free", "paid"],
            default: "free",
        }
    },
    {
        timestamps: true,
    }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;