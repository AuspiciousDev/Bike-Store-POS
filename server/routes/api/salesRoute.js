const express = require("express");
const router = express.Router();
const saleController = require("../../controller/SaleController");

router.post("/create", saleController.createSale);
router.get("/allSales", saleController.getAllSale);
router.get("/:transactionID", saleController.getSale);
router.patch("/update/:transactionID", saleController.patchSale);
router.delete("/delete/:transactionID", saleController.deleteSale);
module.exports = router;
