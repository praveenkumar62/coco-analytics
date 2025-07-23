const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySql');
});

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL
    )
`;

const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        coco_pick DATE,
        coco_taken DATE,
        old_coco INT,
        new_coco INT,
        old_coco_cost INT,
        new_coco_cost INT
    )
`;

db.query(createUsersTable, err => {
    if (err) throw err;
    console.log('✅ users table ready.');
});

db.query(createProductsTable, err => {
    if (err) throw err;
    console.log('✅ products table ready.');
    // db.end(); // Close connection after all done
});

module.exports = db;
