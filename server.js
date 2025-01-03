const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());

// Define the route for '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Define the route for '/data'
app.post('/data', (req, res) => {
  const jsonData = req.body;
  fs.writeFile('/tmp/data.json', JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error writing file');
    }
    fs.readFile('/tmp/data.json', 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading file');
      }
      res.send(data);
    });
  });
});

app.get('/data', (req, res) => {
  fs.readFile('/tmp/data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }
    res.json(JSON.parse(data));
  });
});

// Export the app as a handler for Vercel
module.exports = app;