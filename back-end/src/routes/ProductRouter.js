const express = require("express");
const router = express.Router();
const productController = require('../controllers/ProductController');
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/create-product", authMiddleware, productController.createProduct);
router.put("/update-product/:id", authMiddleware, productController.updateProduct);
router.get("/details-product/:id", productController.getDetailsProduct);
router.delete("/delete-product/:id", productController.deleteProduct);
router.get("/get-all-product/", productController.getAllProduct);




module.exports = router;
