const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors')

const app = express();
const port = 3000;
app.use(cors())

// Create a new SQLite database
const db = new sqlite3.Database('./employees.db');

// Create the users table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    lastName TEXT,
    phoneNumber TEXT,
    email TEXT,
    role TEXT
  )
`, (err) => {
  if (err) {
    console.error(err);
  } else {
    // Call addDefaultUsers only if the table was created
    addDefaultUsers();
  }
});

const addDefaultUsers = () => {
  const defaultUsers = [
    {
      firstName: 'Emily',
      lastName: 'Walker',
      phoneNumber: '555-123-4567',
      email: 'emilywalker@example.com',
      role: 'Manager'
    },
    {
      firstName: 'Michael',
      lastName: 'Hall',
      phoneNumber: '555-901-2345',
      email: 'michaelhall@example.com',
      role: 'Waiter'
    },
    {
      firstName: 'Sarah',
      lastName: 'Lee',
      phoneNumber: '555-111-2222',
      email: 'sarahlee@example.com',
      role: 'Chef'
    }
  ];


  defaultUsers.forEach((user) => {
    db.run(
      'INSERT INTO users (firstName, lastName, phoneNumber, email, role) VALUES (?, ?, ?, ?, ?)',
      [user.firstName, user.lastName, user.phoneNumber, user.email, user.role],
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
  });
};

// Middleware to parse JSON request bodies
app.use(express.json());

// GET all users
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching users');
    } else {
      res.json(rows);
    }
  });
});

// GET sorted users
app.get('/users/sorted', (req, res) => {
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder || 'ASC';

  const query = `SELECT * FROM users ORDER BY ${sortBy} ${sortOrder}`;

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error sorting users');
    } else {
      res.json(rows);
    }
  });
});

// POST a new user
app.post('/users', (req, res) => {
  const { firstName, lastName, phoneNumber, email, role } = req.body;
  db.run(
    'INSERT INTO users (firstName, lastName, phoneNumber, email, role) VALUES (?, ?, ?, ?, ?)',
    [firstName, lastName, phoneNumber, email, role],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error creating user');
      } else {
        res.status(201).send('User created');
      }
    }
  );
});

// PUT (update) a user
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, phoneNumber, email, role } = req.body;

  db.run(
    'UPDATE users SET firstName = ?, lastName = ?, phoneNumber = ?, email = ?, role = ? WHERE id = ?',
    [firstName, lastName, phoneNumber, email, role, userId],
    function(err) {
      if (err) {
        console.error(err);
        res.status(500).send('Error updating user');
      } else if (this.changes === 0) {
        // No rows were updated, which means the user ID was not found
        res.status(404).send('User not found');
      } else {
        res.send('User updated');
      }
    }
  );
});

// DELETE a user
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting user');
    } else {
      res.send('User deleted');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is a running on port ${port}`);
});
