const express = require("express");
const router = express.Router();
const orderController = require('../controllers/OrderController');
const { authUserMiddleware } = require("../middleware/authMiddleware");

router.post("/create", authUserMiddleware, orderController.createOrder);
router.get("/get-all-order/:id", authUserMiddleware, orderController.getAllOrderDetails);
router.get("/get-details-order/:id", authUserMiddleware, orderController.getDetailsOrder);
router.delete("/cancel-order/:id", authUserMiddleware, orderController.cancelOrderDetails);





module.exports = router;
