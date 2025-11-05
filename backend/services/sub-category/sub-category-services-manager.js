import SubCategoryModel from "./sub-category-model.js";

// create a new sub cat for a cat
    export const createSubCat = async (req, res) => {
        // pull params we care about out of the req.body object
            const {subCatName, parentCatID} = req.body;
                        console.log("create subcat service running here is what is in the parentcat of the body", parentCatID)
        // ensure we have everything we need for a request
            if (!subCatName || !parentCatID) {
                return res.status(404).json({message : "Add All Required Fields For Sub Cat"})
            }
        // try to create a new sub cat linked to parent cat
            try {
                const newSubCat = SubCategoryModel.create({
                    sub_category_name : subCatName,
                    parent_category_id : parentCatID
                })
                // if it made it out of that without throwing an error then send success response with what was created in the db
                    if (newSubCat) {
                        res.status(201).json({
                            newSubCat : newSubCat,
                            message : "subcat creatd successfully"
                        })
                    } else {
                        res.status(400).json({ message : "create sub cat ran but was not created for some reason."}) 
                    }
                    
            } catch {
                // an error was thrown
                    res.status(400).json({ message : "An Error On Server Occurrrred"})
            }

    }

// get all sub cats linked to a specific cat
    export const getSubCats = async (req, res) => {
        console.log("get sub cats process service running")
        const {parentCatID} = req.query;
        try {
            const subCats = await SubCategoryModel.find({
                parent_category_id : parentCatID
            })
            res.status(200).json({
                message : "got sub cats",
                subCats
            })
        } catch {
            console.log("some error occurred when getting sub cats...")
        }
    }
