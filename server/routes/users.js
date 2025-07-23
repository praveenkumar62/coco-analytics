const express = require("express");
const router = express.Router();
const { editUser, listUsers, deleteUser } = require("../controllers/userController");

router.get('/list', listUsers);
router.delete('/:id', deleteUser);
router.patch('/:id', editUser);

module.exports = router;