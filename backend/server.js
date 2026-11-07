const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { medicines } = require('./data');

const app = express();
app.use(cors());
app.use(express.json());

// API: Search medicines
app.get('/api/medicines', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json(medicines);

  const query = q.toLowerCase();
  const results = medicines.filter(med =>
    med.name.toLowerCase().includes(query) ||
    med.genericName.toLowerCase().includes(query) ||
    med.tags.some(tag => tag.toLowerCase().includes(query))
  );
  res.json(results);
});

// API: Medicine Detail
app.get('/api/medicines/:id', (req, res) => {
  const med = medicines.find(m => m.id === req.params.id);
  if (!med) return res.status(404).json({ message: 'Medicine not found' });
  res.json(med);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));