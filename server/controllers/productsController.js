const db = require('../initDB');

const listProducts = (req, res) => {
  const userId = req.params.userId;
  db.query("SELECT * FROM products WHERE user_id = ?", [userId], (err, result) => {
    if (err) return res.status(400).json({ message: 'Coconut details fetching error' });
    return res.status(200).json({ data: result });
  });
}

const saveProduct = (req, res) => {
  const userId = req.params.userId;
  const { pickDate, takenDate, oldCount, newCount, oldCost, newCost } = req.body;
  const sql = `
    INSERT INTO products (
      user_id, 
      coco_pick, 
      coco_taken, 
      old_coco, 
      new_coco, 
      old_coco_cost, 
      new_coco_cost
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [userId, pickDate, takenDate, oldCount, newCount, oldCost, newCost], (err, result) => {
    if (err) return res.status(400).json({ message: 'Adding coconut details failed' });
    res.status(200).json({ message: 'Coconut details added successfully' });
  })
}

const editProduct = (req, res) => {
  const id = req.params.id;
  const { pickDate, takenDate, oldCount, newCount, oldCost, newCost } = req.body;
  const sql = `
    UPDATE products SET coco_pick = ?, coco_taken = ?, old_coco = ?, new_coco = ?, old_coco_cost = ?, new_coco_cost = ? WHERE id = ?
  `;
  db.query(sql, [pickDate, takenDate, oldCount, newCount, oldCost, newCost, id], (err, result) => {
    if (err) return res.status(400).json({ message: 'Update failed', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Details not found' });
    return res.status(200).json({ message: 'Updated successfully' });
  })
}

const viewProduct = (req, res) => {
  const id = req.params.id;
  db.query(`SELECT * FROM products where user_id = ?`, [id], (err, result) => {
    if (err) return res.status(400).json({ message: 'Failed to view product', error: err });
    const final = result.sort((a, b) => (a.coco_taken - b.coco_taken))
    return res.status(200).json({ data: final });
  })
}

const deleteProduct = (req, res) => {
  const productId = req.params.id;
  db.query("DELETE from products WHERE id = ?", [productId], (err, result) => {
    if (err) return res.status(400).json({ message: 'Failed to delete details'});
    if (result.affectedRows === 0) return res.status(404).json('Coco details not found');
    return res.status(200).json({ message: 'Details removed successfully' });
  })
}

module.exports = { saveProduct, listProducts, deleteProduct, editProduct, viewProduct };