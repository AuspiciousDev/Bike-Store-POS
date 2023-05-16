const Sale = require("../model/Sale");
const Inventory = require("../model/Inventory");

const setMonday = (dateNow) => {
  let timeLeftTillMonday, timeNow, monday, deltaTime;
  const msInSecond = 1000;
  timeNow = Math.round(dateNow.getTime() / msInSecond);
  console.log("🚀 ~ file: Employee.jsx:411 ~ setMonday ~ timeNow", timeNow);

  monday =
    dateNow.setDate(dateNow.getDate() + ((7 - dateNow.getDay()) % 7) + 1) /
    msInSecond;
  console.log("🚀 ~ file: Employee.jsx:416 ~ setMonday ~ monday", monday);
  timeLeftTillMonday = Math.round(Math.abs(monday - timeNow));
  console.log(
    "🚀 ~ file: Employee.jsx:418 ~ setMonday ~ timeLeftTillMonday",
    timeLeftTillMonday
  );

  return timeLeftTillMonday;
};
const saleController = {
  createSale: async (req, res) => {
    let emptyFields = [];
    try {
      const { transactor, items, totalSum, discountAmount, vatAmount } =
        req.body;
      console.log(
        "🚀 ~ file: SaleController.js:8 ~ createSale: ~ req.body;",
        req.body
      );

      if (!transactor) emptyFields.push("transactor");
      if (!items) emptyFields.push("items");
      if (!totalSum) emptyFields.push("totalSum");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });

      const productObject = {
        transactor,
        items,
        totalSum: totalSum?.toFixed(2),
        discountAmount: discountAmount?.toFixed(2),
        vatAmount: vatAmount?.toFixed(2),
      };
      const createProduct = await Sale.create(productObject);
      console.log(
        "🚀 ~ file: SaleController.js:31 ~ createSale: ~ createProduct",
        createProduct
      );

      let bulkTags = [];
      items.forEach(async (tag) => {
        bulkTags.push({
          updateOne: {
            filter: {
              _id: tag.productID,
              productName: tag.productName,
            },
            update: {
              $inc: {
                quantity: -tag.quantity,
              },
            },
            upsert: true,
          },
        });
      });

      Inventory.bulkWrite(bulkTags, (error, result) => {
        if (error) {
          res.status(400).json({ message: error.message });
        } else {
          console.log(
            "🚀 ~ file: SaleController.js:53 ~ Inventory.bulkWrite ~ result",
            result
          );
        }
      });

      res.status(201).json(createProduct);
    } catch (error) {
      console.log(
        "🚀 ~ file: SaleController.js:49 ~ createSale: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getAllSale: async (req, res) => {
    try {
      const transaction = await Sale.find().sort({ createdAt: -1 }).lean();
      if (!transaction)
        return res.status(204).json({ message: "No transaction Found!" });
      res.status(200).json(transaction);
    } catch (error) {
      console.log(
        "🚀 ~ file: SaleController.js:46 ~ getAllSale: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getSale: async (req, res) => {
    if (!req?.params?.transactionID)
      return res.status(400).json({ message: `Transaction ID is required!` });
    if (req.params.transactionID.length !== 24) {
      return res.status(400).json({ message: `Invalid Transaction ID!` });
    }

    const transactionID = req.params.transactionID;
    try {
      const transaction = await Sale.find({ transactionID }).exec();
      if (transaction.length == 0)
        return res.status(204).json({ message: "Transaction ID not Found!" });
      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  patchSale: async (req, res) => {
    try {
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteSale: async (req, res) => {
    if (!req?.params?.transactionID)
      return res.status(400).json({ message: `Transaction ID is required!` });
    if (req.params.transactionID.length !== 24) {
      return res.status(400).json({ message: `Invalid Transaction ID!` });
    }
    const transactionID = req.params.transactionID;
    console.log(
      "🚀 ~ file: SaleController.js:80 ~ deleteSale: ~ transactionID",
      transactionID
    );
    try {
      const transaction = await Sale.findOne({ transactionID }).exec();
      if (!transaction)
        return res.status(204).json({ message: "Transaction ID not found!" });
      const deleteItem = await transaction.deleteOne({ transactionID });
      console.log(
        "🚀 ~ file: SaleController.js:85 ~ deleteSale: ~ deleteItem",
        deleteItem
      );
      res.json(deleteItem);
    } catch (error) {
      console.log(
        "🚀 ~ file: SaleController.js:80 ~ deleteSale: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = saleController;
