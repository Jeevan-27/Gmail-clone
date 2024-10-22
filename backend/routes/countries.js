const express = require('express');
const router = express.Router();
const countries = require('../data/countries.json'); // Adjust path based on your folder structure

// Route to get all countries
router.get('/', (req, res) => {
  res.status(200).json(countries);
});

module.exports = router;
