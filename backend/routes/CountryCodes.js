const express = require('express');
const router = express.Router();
const CountryCodes = require('../data/CountryCodes.json'); // Adjust path based on your folder structure

// Route to get all countries
router.get('/', (req, res) => {
  res.status(200).json(CountryCodes);
});

module.exports = router;
