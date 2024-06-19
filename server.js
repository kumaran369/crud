const express = require('express');
const mysql = require('mysql2'); // Use mysql2 instead of mysql
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection pool using mysql2
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'crud_db'
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Create
app.post('/add', (req, res) => {
    const { name, description } = req.body;
    pool.query('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], (err, result) => {
        if (err) {
            console.error('Error adding item:', err);
            res.status(500).send('Error adding item');
        } else {
            res.redirect('/');
        }
    });
});

// Read
app.get('/items', (req, res) => {
    pool.query('SELECT * FROM items', (err, results) => {
        if (err) {
            console.error('Error fetching items:', err);
            res.status(500).send('Error fetching items');
        } else {
            res.json(results);
        }
    });
});

// Update
app.post('/update', (req, res) => {
    const { id, name, description } = req.body;
    pool.query('UPDATE items SET name = ?, description = ? WHERE id = ?', [name, description, id], (err, result) => {
        if (err) {
            console.error('Error updating item:', err);
            res.status(500).send('Error updating item');
        } else {
            res.redirect('/');
        }
    });
});

// Delete
app.post('/delete', (req, res) => {
    const { id } = req.body;
    pool.query('DELETE FROM items WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting item:', err);
            res.status(500).send('Error deleting item');
        } else {
            res.redirect('/');
        }
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
