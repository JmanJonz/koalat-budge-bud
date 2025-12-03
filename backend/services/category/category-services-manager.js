import CategoryModel from "../category/category-model.js";
import HouseholdModel from "../household/household-model.js";

// get all categories for household if there is one and user if not
    export const getCategories = async (req, res) => {
        console.log("get cats function is running")
        try {
            let categories;
            // if they are apart of a household, get the household owner's categories
            if (req.authorizedUserInfo.householdId) {
                // Find the household to get the owner
                const household = await HouseholdModel.findById(req.authorizedUserInfo.householdId);
                if (household) {
                    // Get categories created by the household owner
                    categories = await CategoryModel.find({
                        user_id: household.owner
                    })
                } else {
                    categories = [];
                }
            } else {
                // otherwise get all of the categories tied to the userid
                categories = await CategoryModel.find({
                    user_id: req.authorizedUserInfo.userId
                })
            }
            
            res.status(200).json({
                message: "Got Cats",
                categories
            })
        } catch (error) {
            console.log("some error occured", error)
            res.status(500).json({ message: "Error fetching categories", error: error.message })
        }
    }

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private (User must be logged in, and must be household owner or not in household)
    export const createCategory = async (req, res) => {
        console.log("createCategory Function Running")
        console.log("inside of creating category no user / household info sent in the body but this is what I am grabbing from the http only cookie", req.authorizedUserInfo)
        
        // Check if user is in a household
        if (req.authorizedUserInfo.householdId) {
            // Find household to check if user is owner
            const household = await HouseholdModel.findById(req.authorizedUserInfo.householdId);
            if (!household || household.owner.toString() !== req.authorizedUserInfo.userId) {
                return res.status(403).json({ message: "Only household owners can create categories" });
            }
        }
        
        // prepare data for Category creation
            const {categoryName, categoryType} = req.body;
            console.log("categoryname", categoryName, "cattype", categoryType)

        // ensure required fields are present before trying to create a new one
            if (!categoryName || !categoryType) {
                return res.status(404).json({message: "Add all required fields"})
            }
        
        // user should already be authenticated sooo just create the new category. for now this will alow for duplicates because I'm not checking if it exists yet
            try {
                const newCategory = await CategoryModel.create(
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
                    res.status(500).json({ message: "An unexpected error occurred during category creation." });
            }
    }

// delete a category
    export const deleteCategory = async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.authorizedUserInfo.userId;
            const householdId = req.authorizedUserInfo.householdId;
            
            // Check if user is in a household and is the owner
            if (householdId) {
                const household = await HouseholdModel.findById(householdId);
                if (!household || household.owner.toString() !== userId) {
                    return res.status(403).json({ message: "Only household owners can delete categories" });
                }
            }
            
            // Find category and verify ownership
            const category = await CategoryModel.findById(id);
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
            
            // Verify user owns this category
            if (category.user_id.toString() !== userId) {
                return res.status(403).json({ message: "Not authorized to delete this category" });
            }
            
            await CategoryModel.findByIdAndDelete(id);
            
            res.status(200).json({
                message: "Category deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting category:", error);
            res.status(500).json({ message: "Server error deleting category" });
        }
    }