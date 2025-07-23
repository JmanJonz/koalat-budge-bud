import User from "../schemas/User.js" // import user model that you created

// these are non executable comments but good practice for node development
// @desc Create a new user
// @route POST /api/users
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
                const userExists = await User.findOne({$or: [{ email}, { username }]});

                if (userExists) {
                    return res.status(400).json({message: "A user with that username or email already exists"})

                }

                // 4. create a new user in the database using the User model
                //    mongoose will apply the schema's default values (like "free" etc for the tier if not provided)
                    const user = await User.create({
                        username,
                        email,
                        password // !!!! Important as of right now password is saved
                                 // as plaintext, in a real world app this must be 
                                 // encrypted! using something like bcrypt but probably bcrpt itself. 
                    })
                
                // 5. Send a success response if everything went well
                // a 201 status represent created status
                    if (user) {
                        res.status(201).json({
                            _id: user._id,
                            username: user.username,
                            email: user.email,
                            tier: user.tier,
                            message: "User created successfully. Reminder: Password is NOT hashed yet!!"
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