const express = require("express");

const router = express.Router();

const {
    getPackages,
    getPackage
} = require("../controllers/packageController");


/* =========================================
   GET ALL PACKAGES

   GET /api/packages
========================================= */

router.get("/", getPackages);


/* =========================================
   GET PACKAGE BY ID

   GET /api/packages/:id
========================================= */

router.get("/:id", getPackage);


module.exports = router;