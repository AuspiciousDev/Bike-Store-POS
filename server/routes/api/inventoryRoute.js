const express = require("express");
const router = express.Router();
const inventoryController = require("../../controller/InventoryController");

router.post("/create", inventoryController.createProduct);
router.get("/allProducts", inventoryController.getAllProduct);
router.get("/:_id", inventoryController.getProduct);
router.patch("/update/:_id", inventoryController.patchProduct);
router.delete("/delete/:_id", inventoryController.deleteProduct);
router.patch("/status/:_id", inventoryController.toggleProductStatus);
module.exports = router;
