const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure CORS
app.use(cors({
    origin: 'https://crud-git-master-kumaran369s-projects.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

// Serve the frontend
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const connection = mysql.createConnection({
    host: 'monorail.proxy.rlwy.net',
    user: 'root',
    password: 'PvwNXiBCDTYSksYgrHDQhpuuRbzDMjtC',
    database: 'crud_db',
    port: 10792
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

// Routes
app.post('/add', (req, res) => {
    const { name, description } = req.body;
    connection.query('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], (err, result) => {
        if (err) {
            console.error('Error adding item:', err);
            res.status(500).send('Server error');
        } else {
            res.redirect('/');
        }
    });
});

app.get('/items', (req, res) => {
    connection.query('SELECT * FROM items', (err, results) => {
        if (err) {
            console.error('Error fetching items:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});

app.post('/update', (req, res) => {
    const { id, name, description } = req.body;
    connection.query('UPDATE items SET name = ?, description = ? WHERE id = ?', [name, description, id], (err, result) => {
        if (err) {
            console.error('Error updating item:', err);
            res.status(500).send('Server error');
        } else {
            res.redirect('/');
        }
    });
});

app.post('/delete', (req, res) => {
    const { id } = req.body;
    connection.query('DELETE FROM items WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting item:', err);
            res.status(500).send('Server error');
        } else {
            res.redirect('/');
        }
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
