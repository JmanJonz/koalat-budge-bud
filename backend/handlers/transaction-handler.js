import TransactionModel from "../models/Transaction-Model.js";

// these are non executable comments but good practice for node development
// @desc Create a new transaction
// @route POST /gates/transactions
// @access Public

// This function handles the logic for creating a new transaction in the database.
// the whole function is asynchronous so you can use await anywhere you want...
    const createTransaction = async (req, res) => {
        // 1. destructure transaction data from the request body
        //    express's 'app.use(express.json()) middleware in server.js makes 'req.body' available. 
            const {type, amount, category_id, sub_category_id, notes, user_id, household_id} = req.body;

        // 2. Basic Server-Side validation: check if all required fields are provided. 
        // This prevents incomplete data from being sent to the database (the database if setup wont allow this either but it prevents spam attacks...)
            if (!type || !amount || !category_id || !sub_category_id || !user_id || !household_id) {
                return res.status(400).json({message: "Missing required inputs..."})
            }
        // if all is well then try to create new user
            try {
                const transaction = await TransactionModel.create({
                    amount,
                    type,
                    category_id,
                    sub_category_id,
                    notes,
                    user_id,
                    household_id
                })
                // send success if success
                    if (transaction) {
                        res.status(201).json({
                            message: "Transaction Has Been Tracked"
                        })
                    } else {
                        // fallback for unexpected issue during creation
                            res.status(400).json({message: "Error - New transaction was not created..."})

                    }
            } catch (error) {
                // 6. catch any database or validation errors
                    console.log("Error creating transaction:", error);
                    // MongoDB unique index error (code 11000), is handled aboce but this catches others. 
                        res.status(500).json({message: "Server error during transaction creation.", error: error.message})
            }
    };

// You can add other transaction-related handler functions here later (e.g., gettransactionById, updatetransaction, deletetransaction)
// For now, we only need createtransaction.

export {createTransaction}; // since you exported an object you will want to destructure the object upon import to get what you want from inside it...