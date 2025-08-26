import CategoryModel from "../models/category-model.js";

// get all categories for household if there is one and user if not
    export const getCategories = async (req, res) => {
        console.log("get cats function is running")
        // if they are apart of a household get all the categories tied to that household
            if (req.authorizedUserInfo.householdId) {
                try {
                    const categories = await CategoryModel.find({
                        household_id: req.authorizedUserInfo.householdId
                    })
                    res.status(200).json({
                        message: "Got Cats",
                        categories
                    })
                } catch (error) {
                    console.log("some error occured", error)
                }
            }
        // otherwise get all of the categories tied to the userid
    }

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private (User must be logged in)
    export const createCategory = async (req, res) => {
        console.log("createCategory Function Running")
        console.log("inside of creating category no user / household info sent in the body but this is what I am grabbing from the http only cookie", req.authorizedUserInfo)
        // prepare data for Category creation
            const {categoryName, categoryType} = req.body;
            console.log("categoryname", categoryName, "cattype", categoryType)

        // ensure required fields are present before trying to create a new one
            if (!categoryName || !categoryType) {
                return res.status(404).json({message: "Add all required fields"})
            }
        
        // user should already be authenticated sooo just create the new category. for now this will alow for duplicates because I'm not checking if it exists yet
            try {
                const newCategory = CategoryModel.create(
                    {
                        "category_name": categoryName,
                        "category_type": categoryType,
                        "user_id": req.authorizedUserInfo.userId,
                        "household_id": req.authorizedUserInfo.householdId
                    }
                )

                // send a success response if the household was created
                        if(newCategory) {
                            res.status(201).json({
                                _id: newCategory._id,
                                name: newCategory.name,
                                message: "newCategory created successfully"
                            });
                        } else {
                            res.status(400).json({ message: "Error - Category was not created..." });
                        }
            } catch (error) {
                // catch any database or validation errors and send a server error response
                    res.status(500).json({ message: "An unexpected error occurred during household creation." });
            }
    }