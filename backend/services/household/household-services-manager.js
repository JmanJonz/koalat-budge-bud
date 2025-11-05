import HouseholdModel from "../household/household-model.js";

// function will attempt to create a new household using the data in the req
    const createHousehold = async (req, res) => {
        // use try...catch block to handle asynchronous errors
            try {
                // prepare data for household creation
                    const {name, owner, members, invite_code} = req.body;

                    // ensure household name is provided
                        if (!name, !owner, !members, !invite_code) {
                            return res.status(404).json({message: "Please add a household name"})
                        }
                    // otherwise create new household doc in the database
                        const household = await HouseholdModel.create({
                            name,
                            owner,
                            members,
                            invite_code
                        });
                    // send a success response if the household was created
                        if(household) {
                            res.status(201).json({
                                _id: household._id,
                                name: household.name,
                                message: "Household created successfully"
                            });
                        } else {
                            res.status(400).json({ message: "Error - Household was not created..." });
                        }
            } catch (error) {
                // catch any database or validation errors and send a server error response
                    res.status(500).json({ message: "An unexpected error occurred during household creation." });
            }
    }

// export the handler to be used by the household gate middleware
    export {createHousehold};