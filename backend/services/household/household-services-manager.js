import HouseholdModel from "../household/household-model.js";
import UserModel from "../user/user-model.js";
import crypto from "crypto";

// Generate a unique 8-character invite code
const generateInviteCode = () => {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// @desc Create a new household
// @route POST /gateways/household/create
// @access Private
const createHousehold = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.authorizedUserInfo.userId;

        if (!name) {
            return res.status(400).json({ message: "Household name is required" });
        }

        // Check if user already owns a household
        const existingHousehold = await HouseholdModel.findOne({ owner: userId });
        if (existingHousehold) {
            return res.status(400).json({ message: "You already own a household. Leave it first to create a new one." });
        }

        // Generate unique invite code
        let inviteCode;
        let isUnique = false;
        while (!isUnique) {
            inviteCode = generateInviteCode();
            const existing = await HouseholdModel.findOne({ invite_code: inviteCode });
            if (!existing) isUnique = true;
        }

        // Create household
        const household = await HouseholdModel.create({
            name,
            owner: userId,
            members: [userId],
            invite_code: inviteCode
        });

        // Update user's household_id and joined date
        await UserModel.findByIdAndUpdate(userId, { 
            household_id: household._id,
            joined_household_at: new Date()
        });

        res.status(201).json({
            message: "Household created successfully",
            household: {
                _id: household._id,
                name: household.name,
                invite_code: household.invite_code,
                owner: household.owner,
                members: household.members
            }
        });
    } catch (error) {
        console.error("Error creating household:", error);
        res.status(500).json({ message: "Server error creating household", error: error.message });
    }
};

// @desc Join a household using invite code
// @route POST /gateways/household/join
// @access Private
const joinHousehold = async (req, res) => {
    try {
        const { invite_code } = req.body;
        const userId = req.authorizedUserInfo.userId;

        if (!invite_code) {
            return res.status(400).json({ message: "Invite code is required" });
        }

        // Find household by invite code
        const household = await HouseholdModel.findOne({ invite_code: invite_code.toUpperCase() });
        if (!household) {
            return res.status(404).json({ message: "Invalid invite code" });
        }

        // Check if user is already in a household
        const user = await UserModel.findById(userId);
        if (user.household_id) {
            return res.status(400).json({ message: "You are already in a household. Leave it first to join another." });
        }

        // Check if user is already a member
        if (household.members.includes(userId)) {
            return res.status(400).json({ message: "You are already a member of this household" });
        }

        // Add user to household
        household.members.push(userId);
        await household.save();

        // Update user's household_id and joined date
        await UserModel.findByIdAndUpdate(userId, { 
            household_id: household._id,
            joined_household_at: new Date()
        });

        res.status(200).json({
            message: "Successfully joined household",
            household: {
                _id: household._id,
                name: household.name,
                owner: household.owner,
                members: household.members
            }
        });
    } catch (error) {
        console.error("Error joining household:", error);
        res.status(500).json({ message: "Server error joining household", error: error.message });
    }
};

// @desc Leave current household
// @route POST /gateways/household/leave
// @access Private
const leaveHousehold = async (req, res) => {
    try {
        const userId = req.authorizedUserInfo.userId;

        const user = await UserModel.findById(userId);
        if (!user.household_id) {
            return res.status(400).json({ message: "You are not in a household" });
        }

        const household = await HouseholdModel.findById(user.household_id);
        if (!household) {
            return res.status(404).json({ message: "Household not found" });
        }

        // If user is owner, delete the household
        if (household.owner.toString() === userId) {
            // Remove household_id and joined date from all members
            await UserModel.updateMany(
                { household_id: household._id },
                { $unset: { household_id: "", joined_household_at: "" } }
            );
            await HouseholdModel.findByIdAndDelete(household._id);
            return res.status(200).json({ message: "Household deleted successfully" });
        }

        // Remove user from household members
        household.members = household.members.filter(memberId => memberId.toString() !== userId);
        await household.save();

        // Remove household_id and joined date from user
        await UserModel.findByIdAndUpdate(userId, { $unset: { household_id: "", joined_household_at: "" } });

        res.status(200).json({ message: "Successfully left household" });
    } catch (error) {
        console.error("Error leaving household:", error);
        res.status(500).json({ message: "Server error leaving household", error: error.message });
    }
};

// @desc Get current household info
// @route GET /gateways/household/info
// @access Private
const getHouseholdInfo = async (req, res) => {
    try {
        const userId = req.authorizedUserInfo.userId;

        const user = await UserModel.findById(userId);
        if (!user.household_id) {
            return res.status(200).json({ household: null });
        }

        const household = await HouseholdModel.findById(user.household_id);

        if (!household) {
            return res.status(404).json({ message: "Household not found" });
        }

        // Backfill joined_household_at for existing users who don't have it
        // This is a one-time migration for users who joined before this field was added
        if (!user.joined_household_at) {
            await UserModel.findByIdAndUpdate(userId, { 
                joined_household_at: household.createdAt || new Date()
            });
        }

        // Manually fetch owner and members
        const owner = await UserModel.findById(household.owner).select('username email');
        const members = await Promise.all(
            household.members.map(async (memberId) => {
                const member = await UserModel.findById(memberId).select('username email');
                // Backfill for other members too
                if (member && !member.joined_household_at) {
                    await UserModel.findByIdAndUpdate(memberId, { 
                        joined_household_at: household.createdAt || new Date()
                    });
                }
                return member;
            })
        );

        res.status(200).json({
            household: {
                _id: household._id,
                name: household.name,
                invite_code: household.invite_code,
                owner: owner,
                members: members,
                isOwner: household.owner.toString() === userId
            }
        });
    } catch (error) {
        console.error("Error getting household info:", error);
        res.status(500).json({ message: "Server error getting household info", error: error.message });
    }
};

export { createHousehold, joinHousehold, leaveHousehold, getHouseholdInfo };