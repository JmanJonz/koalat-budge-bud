import UserModel from "../models/user-model.js" // import user model that you created
import bcrypt from "bcrypt"
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// code that is ran when this file is imported
    dotenv.config();

// generate a new token
    const generateToken = (JWTContent) => {
        return jwt.sign(JWTContent, process.env.JWT_SECRET, {
            expiresIn: "1h", // token expires in one hour... you will want to setup refresh tokens!
        })
    };

// these are non executable comments but good practice for node development
// @desc Create a new user
// @route POST /gates/users
// @access Public

// This function handles the logic for creating a new user in the database.
    const createUser = async (req, res) => {
        // 1. destructure user data from the request body
        //    express's 'app.use(express.json()) middleware in server.js makes 'req.body' available. 
            const {username, email, password} = req.body;

        // 2. Basic Server-Side validation: check if all required fields are provided. 
        //    This prevents incomplete data from being sent to the database (the database if setup wont allow this either but it prevents spam attacks...)
            if (!username || !email || !password) {
                return res.status(400).json({message: "Missing required inputs..."})
            }

        // 3. check for existing user (by email or username) to prevent duplicates.
            try {
                const userExists = await UserModel.findOne({$or: [{ email}, { username }]});

                if (userExists) {
                    return res.status(400).json({message: "A user with that username or email already exists"})

                }

                // * hash the password with tried and true bcrypt hash algorithm
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);

                // 4. create a new user in the database using the User model
                //    mongoose will apply the schema's default values (like "free" etc for the tier if not provided)
                    const user = await UserModel.create({
                        username,
                        email,
                        "password" : hashedPassword // !!!! Important security measure don't store peoples passwords in the db!
                    })
                
                // 5. Send a success response if everything went well
                // a 201 status represent created status
                    if (user) {
                        res.status(201).json({
                            _id: user._id,
                            username: user.username,
                            email: user.email,
                            tier: user.tier,
                            message: "User created successfully."
                        })
                    } else {
                        // fallback for unexpected issue during creation
                            res.status(400).json({message: "Error - New user was not created..."})
                    }
            } catch (error) {
                // 6. catch any database or validation errors
                    console.log("Error creating user:", error);
                    // MongoDB unique index error (code 11000), is handled aboce but this catches others. 
                        res.status(500).json({message: "Server error during user creation.", error: error.message})
            }
    };

// You can add other user-related handler functions here later (e.g., getUserById, updateUser, deleteUser)
// For now, we only need createUser.

// function that handles logging a user in an authenticating them in a way where they don't have to relogin over and over
    export const authenticateUser = async (req, res) => {
        // logic to find and validate user from the database
            const {email, password} = req.body;
        // check if the user exists in the database by their identifier their email...
            const user = await UserModel.findOne({email});
            if (!user) {
                return res.status(401).json({message: "Invalid credentials"});
            }
        // compare incoming password with the stored hashed password using bcrypt
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({message: "Invalid credentials"});
            }
        // otherwise the user is authenticated so setup saved login for sub request
            // this is the information that will be baked into the jwt and come in with every request from the user
                const payload = {
                    _id : user._id,
                    email : user.email,
                    household : user.household,
                    tier : user.tier
                };
                const cookieOptions = {
                    // 1. Mark the cookie as HttpOnly
                    // This prevents client-side JavaScript from accessing it.
                    httpOnly: true,

                    // 2. Set the cookie's expiration
                    // This should match the JWT's expiration.
                    maxAge: 60 * 60 * 1000, // 1 hour in milliseconds

                    // 3. Make it Secure (recommended for production)
                    // The browser will only send this cookie over HTTPS.
                    // In development, you might set this to `false`.
                    secure: false,// process.env.NODE_ENV === "production",

                    // 4. Set SameSite (important for CSRF protection)
                    // Prevents the browser from sending the cookie with cross-site requests.
                    // For most modern use cases, 'Lax' or 'Strict' is best.
                    sameSite: "Lax",
                };
            // generate the JSON Web Token (JWT) signed with a secret hashed passkey
            // so we know that we were the one that gave it to this person
            // and it should mean they are who they say they are unless someone else gets ahold of it
                const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1hr"});
                // send a 200 OK response with the JWT
                    res.cookie("jsonWebToken", token, cookieOptions)
                    res.status(200).json({
                        message: "Login successful!",
                        user: {
                            id: user._id,
                            email: user.email,
                        },
                    });
    }

export {createUser}; // since you exported an object you will want to destructure the object upon import to get what you want from inside it...