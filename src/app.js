const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 80;
const dbFilePath = './data/db.json';

app.use(bodyParser.json());
app.use(cors()); 


function readDatabase() {
  const data = fs.readFileSync(dbFilePath);
  return JSON.parse(data);
}

function writeDatabase(data) {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
}

app.get('/users', (req, res) => {
  const db = readDatabase();
  res.json(db.users);
});

app.post('/users', (req, res) => {
  const db = readDatabase();
  const newUser = req.body;
  db.users.push(newUser);
  writeDatabase(db);
  res.json(newUser);
});

app.patch('/userProgress/:id', (req, res) => {
  const db = readDatabase();
  const id = parseInt(req.params.id);
  const userProgress = req.body;

  const userIndex = db.userProgress.findIndex(up => up.id === id);

  if (userIndex !== -1) {
    db.userProgress[userIndex] = { ...db.userProgress[userIndex], ...userProgress };
    writeDatabase(db);
    res.json(db.userProgress[userIndex]);
  } else {
    res.status(404).json({ error: 'User progress not found' });
  }
});

app.post('/userProgress', (req, res) => {
  const db = readDatabase();
  const newUserProgress = req.body;
  db.userProgress.push(newUserProgress);
  writeDatabase(db);
  res.json(newUserProgress);
});

app.get('/userProgress/:id', (req, res) => {
  const db = readDatabase();
  const id = parseInt(req.params.id);
  const userProgress = db.userProgress.find(up => up.id === id);

  if (userProgress) {
    res.json(userProgress);
  } else {
    res.status(404).json({ error: 'User progress not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
