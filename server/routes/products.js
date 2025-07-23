const express = require("express");
const router = express.Router();
const { listProducts, saveProduct, deleteProduct, editProduct } = require("../controllers/productsController");

router.post("/save/:userId", saveProduct);
router.get("/:userId/list", listProducts);
router.delete("/delete/:id", deleteProduct);
router.put("/update/:id", editProduct);

module.exports = router;