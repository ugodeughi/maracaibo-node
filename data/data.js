const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  const filePath = path.join('/tmp', 'data.json'); // Usa la directory temporanea

  if (req.method === 'POST') {
    const jsonData = req.body;
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing file');
      }
      res.status(200).send('File written successfully');
    });
  } else if (req.method === 'GET') {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(404).json({ error: 'File not found' });
      }
      res.status(200).json(JSON.parse(data));
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}