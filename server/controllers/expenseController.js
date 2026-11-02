
const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const User = require("../models/User");

async function getVendor(req, res) {
    const { vendorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        res.status(400).json({
            success: false,
            message: "Invalid vendor ID.",
        });
        return null;
    }

    const vendor = await User.findById(vendorId);

    if (!vendor) {
        res.status(404).json({
            success: false,
            message: "Vendor not found.",
        });
        return null;
    }

    if (vendor.role !== "vendor" || vendor.vendorStatus !== "approved") {
        res.status(403).json({
            success: false,
            message: "Approved vendor account required.",
        });
        return null;
    }

    return vendor;
}

exports.getExpenses = async (req, res) => {
    try {
        const vendor = await getVendor(req, res);
        if (!vendor) return;

        const expenses = await Expense.find({
            vendorId: vendor._id,
        }).sort({ date: -1, createdAt: -1 });

        return res.json({
            success: true,
            expenses,
        });
    } catch (error) {
        console.error("Get expenses error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to load expenses.",
        });
    }
};

exports.addExpense = async (req, res) => {
    try {
        const vendor = await getVendor(req, res);
        if (!vendor) return;

        const description =
            typeof req.body.description === "string"
                ? req.body.description.trim()
                : "";

        const amount = Number(req.body.amount);

        if (
            !description ||
            description.length > 200 ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid description and amount.",
            });
        }

        const expense = await Expense.create({
            vendorId: vendor._id,
            description,
            amount,
        });

        return res.status(201).json({
            success: true,
            message: "Expense saved successfully.",
            expense,
        });
    } catch (error) {
        console.error("Add expense error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to save expense.",
        });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const vendor = await getVendor(req, res);
        if (!vendor) return;

        if (!mongoose.Types.ObjectId.isValid(req.params.expenseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid expense ID.",
            });
        }

        const expense = await Expense.findOneAndDelete({
            _id: req.params.expenseId,
            vendorId: vendor._id,
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found.",
            });
        }

        return res.json({
            success: true,
            message: "Expense deleted successfully.",
        });
    } catch (error) {
        console.error("Delete expense error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete expense.",
        });
    }
};

exports.migrateExpenses = async (req, res) => {
    try {
        const vendor = await getVendor(req, res);
        if (!vendor) return;

        const expenses = req.body.expenses;

        if (!Array.isArray(expenses) || expenses.length > 500) {
            return res.status(400).json({
                success: false,
                message: "Invalid expenses list. Maximum 500 expenses.",
            });
        }

        const operations = [];

        for (const item of expenses) {
            const legacyId =
                typeof item.id === "string" ||
                typeof item.id === "number"
                    ? String(item.id)
                    : "";

            const description =
                typeof item.description === "string"
                    ? item.description.trim()
                    : "";

            const amount = Number(item.amount);
            const date = item.date ? new Date(item.date) : new Date();

            if (
                !legacyId ||
                !description ||
                description.length > 200 ||
                !Number.isFinite(amount) ||
                amount <= 0 ||
                Number.isNaN(date.getTime())
            ) {
                return res.status(400).json({
                    success: false,
                    message: "One or more old expenses contain invalid data.",
                });
            }

            operations.push({
                updateOne: {
                    filter: {
                        vendorId: vendor._id,
                        legacyId,
                    },
                    update: {
                        $setOnInsert: {
                            vendorId: vendor._id,
                            legacyId,
                            description,
                            amount,
                            date,
                        },
                    },
                    upsert: true,
                },
            });
        }

        if (operations.length > 0) {
            await Expense.bulkWrite(operations, { ordered: true });
        }

        return res.json({
            success: true,
            message: "Old expenses migrated successfully.",
            count: operations.length,
        });
    } catch (error) {
        console.error("Migrate expenses error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to migrate old expenses.",
        });
    }
};
