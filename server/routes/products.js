const express = require("express");
const router = express.Router();
const { listProducts, saveProduct, deleteProduct, editProduct, viewProduct } = require("../controllers/productsController");

router.post("/:userId/save", saveProduct);
router.get("/:userId/list", listProducts);
router.get("/view/:id", viewProduct);
router.delete("/delete/:id", deleteProduct);
router.put("/update/:id", editProduct);

module.exports = router;