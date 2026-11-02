
const express = require("express");
const router = express.Router();

const {
    getExpenses,
    addExpense,
    deleteExpense,
    migrateExpenses,
} = require("../controllers/expenseController");

router.get("/:vendorId", getExpenses);
router.post("/:vendorId", addExpense);
router.post("/:vendorId/migrate", migrateExpenses);
router.delete("/:vendorId/:expenseId", deleteExpense);

module.exports = router;
