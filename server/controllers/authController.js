const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../initDB");

const registerUser = async (req, res) => {
  const { name, username, password, phone } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.query(
    "INSERT INTO users (name, username, password, phone) VALUES (?, ?, ?, ?)",
    [name, username, hashed, phone],
    (err) => {
      if (err) return res.status(400).json({ message: "User creation failed" });
      res.status(201).json({ message: "User created successfully" });
    }
  );
};

const loginUser = (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, result) => {
      if (err || result.length === 0)
        return res.status(401).json({ message: "User not found" });
      const checkPass = await bcrypt.compare(password, result[0].password);
      if (!checkPass)
        return res.status(201).json({ message: "Incorrect password" });

      const token = jwt.sign({ userId: result[0].id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({
        token,
        id: result[0].id,
        name: result[0].name,
        username: result[0].username,
      });
    }
  );
};

module.exports = { registerUser, loginUser };
