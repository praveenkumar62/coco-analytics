const express = require("express");
const router = express.Router();
const { listProducts, saveProduct, deleteProduct, editProduct, viewProduct, productsGroupBy } = require("../controllers/productsController");

router.post("/:userId/save", saveProduct);
router.get("/:userId/list", listProducts);
router.get("/:userId/list/charts", productsGroupBy);
router.get("/view/:userId", viewProduct);
router.delete("/delete/:id", deleteProduct);
router.put("/update/:id", editProduct);

module.exports = router;