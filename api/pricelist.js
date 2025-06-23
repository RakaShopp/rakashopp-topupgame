const express = require('express');
const md5 = require('md5');
const fetch = require('node-fetch');

const router = express.Router();

const API_KEY = process.env.API_KEY_VIP;
const USERNAME = process.env.USERNAME_VIP;

// Helper to generate sign
function generateSign(username, apiKey) {
  return md5(username + apiKey);
}

// Pricelist for top up game, pulsa, kuota, PPOB
router.get('/', async (req, res) => {
  try {
    const sign = generateSign(USERNAME, API_KEY);
    const url = `https://vip-reseller.co.id/api/game-feature?key=${API_KEY}&sign=${sign}&type=all&cmd=pricelist`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pricelist' });
  }
});

module.exports = router;