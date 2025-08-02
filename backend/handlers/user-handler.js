import UserModel from "../models/user-model.js" // import user model that you created
import bcrypt from "bcrypt"

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

export {createUser}; // since you exported an object you will want to destructure the object upon import to get what you want from inside it...