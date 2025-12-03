import TransactionModel from "../transaction/transaction-model.js";
import CategoryModel from "../category/category-model.js";
import SubCategoryModel from "../sub-category/sub-category-model.js";
import UserModel from "../user/user-model.js";
import HouseholdModel from "../household/household-model.js";
import mongoose from "mongoose";

// these are non executable comments but good practice for node development
// @desc Create a new transaction
// @route POST /gateways/transactions
// @access Public

// This function handles the logic for creating a new transaction in the database.
// the whole function is asynchronous so you can use await anywhere you want...
    const createTransaction = async (req, res) => {
        // 1. destructure transaction data from the request body
        //    express's 'app.use(express.json()) middleware in server.js makes 'req.body' available. 
            const {type, amount, category_id, sub_category_id, notes, user_id, household_id} = req.body;

        // 2. Basic Server-Side validation: check if all required fields are provided. 
        // This prevents incomplete data from being sent to the database (the database if setup wont allow this either but it prevents spam attacks...)
            if (!type || !amount || !category_id || !sub_category_id || !user_id) {
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

// @desc Get all transactions with optional filters
// @route GET /gateways/transactions/get-all
// @access Private
const getTransactions = async (req, res) => {
    try {
        const { startDate, endDate, category_id, type } = req.query;
        const userId = req.authorizedUserInfo.userId;
        const householdId = req.authorizedUserInfo.householdId;

        // Build query object
        let query = {};
        
        // Filter by household members or user
        if (householdId) {
            // Fetch household to get owner and members
            const household = await HouseholdModel.findById(householdId);
            if (household && household.members.length > 0) {
                // Build $or query: owner's all transactions OR members' transactions after join date
                const memberQueries = [];
                
                for (const memberId of household.members) {
                    const member = await UserModel.findById(memberId);
                    if (member) {
                        if (household.owner.toString() === memberId.toString()) {
                            // Owner: include ALL transactions
                            memberQueries.push({ user_id: memberId });
                        } else if (member.joined_household_at) {
                            // Other members: only transactions after joining
                            memberQueries.push({
                                user_id: memberId,
                                createdAt: { $gte: member.joined_household_at }
                            });
                        }
                    }
                }
                
                if (memberQueries.length > 0) {
                    query.$or = memberQueries;
                } else {
                    query.user_id = userId;
                }
            } else {
                query.user_id = userId;
            }
        } else {
            query.user_id = userId;
        }

        // Optional filters
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }
        if (category_id) query.category_id = category_id;
        if (type) query.type = type;

        const transactions = await TransactionModel.find(query)
            .sort({ createdAt: -1 });

        // Manually populate the related data
        const enrichedTransactions = await Promise.all(transactions.map(async (transaction) => {
            const category = await CategoryModel.findById(transaction.category_id);
            const subCategory = await SubCategoryModel.findById(transaction.sub_category_id);
            const user = await UserModel.findById(transaction.user_id);
            
            return {
                ...transaction.toObject(),
                category_id: {
                    _id: category?._id,
                    category_name: category?.category_name
                },
                sub_category_id: {
                    _id: subCategory?._id,
                    sub_category_name: subCategory?.sub_category_name
                },
                user_id: {
                    _id: user?._id,
                    username: user?.username
                }
            };
        }));

        res.status(200).json({
            message: "Transactions retrieved successfully",
            transactions: enrichedTransactions,
            count: enrichedTransactions.length
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Server error fetching transactions", error: error.message });
    }
};

// @desc Update a transaction
// @route PUT /gateways/transactions/update/:id
// @access Private
const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, type, category_id, sub_category_id, notes } = req.body;

        // Find and verify ownership
        const transaction = await TransactionModel.findById(id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Verify user owns this transaction OR is the household owner
        const userId = req.authorizedUserInfo.userId;
        const householdId = req.authorizedUserInfo.householdId;
        
        // Check if user owns the transaction
        const ownsTransaction = transaction.user_id.toString() === userId;
        
        // If user doesn't own the transaction, check if they're the household owner
        let isHouseholdOwner = false;
        if (!ownsTransaction && householdId) {
            const household = await HouseholdModel.findById(householdId);
            isHouseholdOwner = household && household.owner.toString() === userId;
        }
        
        if (!ownsTransaction && !isHouseholdOwner) {
            return res.status(403).json({ message: "Not authorized to update this transaction. Only the transaction creator or household owner can edit." });
        }

        // Update fields
        if (amount !== undefined) transaction.amount = amount;
        if (type) transaction.type = type;
        if (category_id) transaction.category_id = category_id;
        if (sub_category_id) transaction.sub_category_id = sub_category_id;
        if (notes !== undefined) transaction.notes = notes;

        await transaction.save();

        res.status(200).json({
            message: "Transaction updated successfully",
            transaction
        });
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ message: "Server error updating transaction", error: error.message });
    }
};

// @desc Delete a transaction
// @route DELETE /gateways/transactions/delete/:id
// @access Private
const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and verify ownership
        const transaction = await TransactionModel.findById(id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Verify user owns this transaction OR is the household owner
        const userId = req.authorizedUserInfo.userId;
        const householdId = req.authorizedUserInfo.householdId;
        
        // Check if user owns the transaction
        const ownsTransaction = transaction.user_id.toString() === userId;
        
        // If user doesn't own the transaction, check if they're the household owner
        let isHouseholdOwner = false;
        if (!ownsTransaction && householdId) {
            const household = await HouseholdModel.findById(householdId);
            isHouseholdOwner = household && household.owner.toString() === userId;
        }
        
        if (!ownsTransaction && !isHouseholdOwner) {
            return res.status(403).json({ message: "Not authorized to delete this transaction. Only the transaction creator or household owner can delete." });
        }

        await TransactionModel.findByIdAndDelete(id);

        res.status(200).json({
            message: "Transaction deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ message: "Server error deleting transaction", error: error.message });
    }
};

// @desc Get transaction summary/analytics
// @route GET /gateways/transactions/summary
// @access Private
const getTransactionSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const userId = req.authorizedUserInfo.userId;
        const householdId = req.authorizedUserInfo.householdId;

        // Build match stage
        let matchStage = {};
        if (householdId) {
            // Fetch household to get owner and members
            const household = await HouseholdModel.findById(householdId);
            if (household && household.members.length > 0) {
                // Build $or conditions: owner's all transactions OR members' transactions after join date
                const memberConditions = [];
                
                for (const memberId of household.members) {
                    const member = await UserModel.findById(memberId);
                    if (member) {
                        if (household.owner.toString() === memberId.toString()) {
                            // Owner: include ALL transactions
                            memberConditions.push({ user_id: new mongoose.Types.ObjectId(memberId) });
                        } else if (member.joined_household_at) {
                            // Other members: only transactions after joining
                            memberConditions.push({
                                user_id: new mongoose.Types.ObjectId(memberId),
                                createdAt: { $gte: member.joined_household_at }
                            });
                        }
                    }
                }
                
                if (memberConditions.length > 0) {
                    matchStage.$or = memberConditions;
                } else {
                    matchStage.user_id = new mongoose.Types.ObjectId(userId);
                }
            } else {
                matchStage.user_id = new mongoose.Types.ObjectId(userId);
            }
        } else {
            matchStage.user_id = new mongoose.Types.ObjectId(userId);
        }

        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        // Aggregation pipeline
        const summary = await TransactionModel.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Category breakdown
        const categoryBreakdown = await TransactionModel.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category_id',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $group: {
                    _id: {
                        type: '$type',
                        category_id: '$category_id',
                        category_name: '$category.category_name'
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);

        // Format response
        const inflowData = summary.find(s => s._id === 'inflow') || { total: 0, count: 0 };
        const outflowData = summary.find(s => s._id === 'outflow') || { total: 0, count: 0 };

        res.status(200).json({
            message: "Summary retrieved successfully",
            summary: {
                totalInflow: inflowData.total,
                totalOutflow: outflowData.total,
                netBalance: inflowData.total - outflowData.total,
                inflowCount: inflowData.count,
                outflowCount: outflowData.count,
                totalTransactions: inflowData.count + outflowData.count
            },
            categoryBreakdown
        });
    } catch (error) {
        console.error("Error fetching transaction summary:", error);
        res.status(500).json({ message: "Server error fetching summary", error: error.message });
    }
};

export { createTransaction, getTransactions, updateTransaction, deleteTransaction, getTransactionSummary };