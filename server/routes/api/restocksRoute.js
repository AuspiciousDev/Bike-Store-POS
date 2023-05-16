const express = require("express");
const router = express.Router();
const restockController = require("../../controller/RestockController");

router.post("/create", restockController.createRestock);
router.get("/allRestocks", restockController.getAllRestock);
router.get("/:_id", restockController.getRestock);
router.patch("/update/:_id", restockController.patchRestock);
router.delete("/delete/:_id", restockController.deleteRestock);
module.exports = router;
