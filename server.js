const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose(); // Use SQLite for the database

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Database connected');
    // Create users table if it doesn't exist
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT, token TEXT)');
  }
});

// Read products from JSON file
const getProducts = () => {
  const data = fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8');
  return JSON.parse(data);
};

// User Registration Route (POST /api/register)
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;

  // Check if email already exists
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (row) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: 'Error hashing password' });
      }

      // Insert new user into the database
      db.run(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword],
        function (err) {
          if (err) {
            return res.status(500).json({ error: 'Error registering user' });
          }
          return res.status(201).json({ message: 'User registered successfully' });
        }
      );
    });
  });
});

// User Login Route (POST /api/login)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare hashed password with stored password
    bcrypt.compare(password, row.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Error comparing passwords' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate a simple token (in a production app, use JWT)
      const token = `sample-token-${Date.now()}`;

      // Save the token in the database (optional)
      db.run("UPDATE users SET token = ? WHERE email = ?", [token, email], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error saving token' });
        }

        return res.json({ token });
      });
    });
  });
});

// Product Search Route (GET /api/products?search=...)
app.get('/api/products', (req, res) => {
  const query = req.query.search || '';
  const products = getProducts();
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  res.json(filteredProducts);
});

// Get Product Details Route (GET /api/products/:id)
app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const products = getProducts();
  const product = products.find(p => p.id === productId);

  if (product) {
    return res.json(product);
  }

  return res.status(404).json({ error: "Product not found" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});