const Inventory = require("../model/Inventory");

const inventoryController = {
  createProduct: async (req, res) => {
    let emptyFields = [];
    try {
      // Get product details
      const { productName, price, quantity, brand, category, supplier } =
        req.body;
      // Validate if empty fields
      if (!productName) emptyFields.push("productName");
      if (!price) emptyFields.push("price");
      if (!quantity) emptyFields.push("quantity");
      if (!brand) emptyFields.push("brand");
      if (!category) emptyFields.push("category");
      if (!supplier) emptyFields.push("supplier");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });
      const duplicate = await Inventory.findOne({ productName }).lean().exec();
      if (duplicate)
        return res
          .status(409)
          .json({ message: `Product [${productName}] already registered!` });

      const productObject = {
        productName,
        price,
        quantity,
        brand,
        category,
        supplier,
      };
      const createProduct = await Inventory.create(productObject);
      res.status(201).json(createProduct);
    } catch (error) {
      console.log(
        "🚀 ~ file: Inventorycontroller.js:47 ~ createProduct: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getAllProduct: async (req, res) => {
    const inventory = await Inventory.find().sort({ createdAt: -1 }).lean();
    if (!inventory)
      return res.status(204).json({ message: "No Products Found!" });
    res.status(200).json(inventory);
  },
  getProduct: async (req, res) => {
    if (!req?.params?._id)
      return res.status(400).json({ message: `_id is required!` });
    if (req.params._id.length !== 24) {
      return res.status(400).json({ message: `Invalid product _id!` });
    }
    const _id = req.params._id;
    try {
      const product = await Inventory.findOne({ _id }).exec();
      if (!product)
        return res.status(204).json({ message: "Product _id not Found!" });
      res.status(200).json(product);
    } catch (error) {
      console.log(
        "🚀 ~ file: InventoryController.js:70 ~ getProduct: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  patchProduct: async (req, res) => {
    if (!req?.params?._id)
      return res.status(400).json({ message: `_id is required!` });
    if (req.params._id.length !== 24) {
      return res.status(400).json({ message: `Invalid product _id!` });
    }
    const _id = req.params._id;
    try {
      const product = await Inventory.findOne({ _id }).exec();
      if (!product)
        return res.status(204).json({ message: "Product not Found!" });
      const { productName, price, quantity, brand, category, supplier } =
        req.body;
      const update = await Inventory.findOneAndUpdate(
        { _id },
        {
          productName,
          price,
          quantity,
          brand,
          category,
          supplier,
        }
      );
      if (!update) {
        return res.status(400).json({ error: "Product update failed!" });
      }
      res.status(200).json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: InventoryController.js:90 ~ patchProduct: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    if (!req?.params?._id)
      return res.status(400).json({ message: `_id is required!` });
    if (req.params._id.length !== 24) {
      return res.status(400).json({ message: `Invalid product _id!` });
    }
    try {
      const _id = req.params._id;
      const product = await Inventory.findOne({ _id }).exec();
      if (!product)
        return res.status(204).json({ message: "Product not found!" });
      const deleteItem = await product.deleteOne({ _id });
      res.json(deleteItem);
    } catch (error) {
      console.log(
        "🚀 ~ file: Inventorycontroller.js:138 ~ deleteProduct: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  toggleProductStatus: async (req, res) => {
    if (!req?.params?._id)
      return res.status(400).json({ message: `_id is required!` });
    if (req.params._id.length !== 24) {
      return res.status(400).json({ message: `Invalid product _id!` });
    }
    try {
      const _id = req.params._id;
      const { status } = req.body;
      const product = await Inventory.findOne({ _id }).exec();
      if (!product) return res.status(204).json({ message: "No Users Found!" });
      const update = await Inventory.findOneAndUpdate(
        { _id },
        {
          status,
        }
      );
      if (!update) {
        return res.status(400).json({ message: "User update failed" });
      }
      console.log(update);
      res.status(200).json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: Inventorycontroller.js:168 ~ toggleProductStatus: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = inventoryController;
