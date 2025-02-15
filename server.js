const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Percorso del file persistente sul volume montato
const DATA_FILE_PATH = path.join('/mnt/data', 'data.json');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Define the route for '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define the route for '/data'
app.post('/data', (req, res) => {
  const jsonData = req.body;
  fs.writeFile(DATA_FILE_PATH, JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error writing file');
    }
    fs.readFile(DATA_FILE_PATH, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading file');
      }
      res.send(data);
    });
  });
});

// Ensure data.json exists with default content if it doesn't
app.get('/data', (req, res) => {
  fs.access(DATA_FILE_PATH, fs.constants.F_OK, (err) => {
    if (err) {
      fs.writeFile(DATA_FILE_PATH, '[]', (err) => {
        if (err) {
          console.error('Error creating data.json with default content');
        }
      });
    }
  });
  fs.readFile(DATA_FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }
    res.json(JSON.parse(data));
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});