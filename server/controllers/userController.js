const bcrypt = require('bcrypt');
const db = require('../initDB');

const listUsers = async (req, res) => {
  db.query("SELECT id, name, username, phone FROM users", async (err, result) => {
    if (err) return res.status(400).json({ message: 'Error in fetching users'});
    return res.status(200).json({ data: result });
  });
}

const deleteUser = async (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM users WHERE id = ?", [id], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to delete user'});
    if (result?.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'User deleted successfully' });
  });
}

const editUser = async (req, res) => {
  const id = req.params.id;
  const { name, username, phone, oldPassword, newPassword } = req.body;
  const fields = [];
  const values = [];

  if (name) {
    fields.push('name = ?');
    values.push(name);
  }
  if (username) {
    fields.push('username = ?');
    values.push(username);
  }
  if (phone) {
    fields.push('phone = ?');
    values.push(phone);
  }
  if (oldPassword && newPassword) {
    db.query("SELECT password FROM users WHERE id = ?", [id], async (err, result) => {
      if (err || result?.length === 0) return res.status(400).json({ message: 'User not found' });
      const isOldPassMatch = await bcrypt.compare(oldPassword, result[0].password);
      if (!isOldPassMatch) {
        return res.status(400).json({ message: 'Old password is incorrect' });
      }
      if (isOldPassMatch) {
        fields.push('password = ?');
        const hashed = await bcrypt.hash(newPassword, 10);
        values.push(hashed);
        storeData(id, fields, values);
      }
    })
  } else if (!oldPassword && !newPassword) {
    storeData(id, fields, values);
  } else {
    return res.status(404).json({ message: 'Old password or new password is missing'});
  }

  function storeData(id, fields, values) {
    db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, [...values, id], async (err, result) => {
      if (err) return res.status(400).json({ message: 'Update failed' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json({ message: 'User updated successfully' });
    })
  }
  
}

module.exports = { editUser, listUsers, deleteUser };