const express = require('express');
const md5 = require('md5');
const fetch = require('node-fetch');

const router = express.Router();

const API_KEY = process.env.API_KEY_VIP;
const USERNAME = process.env.USERNAME_VIP;

function generateSign(username, apiKey) {
  return md5(username + apiKey);
}

router.post('/', async (req, res) => {
  try {
    const { type, service, target, order_id } = req.body;
    const sign = generateSign(USERNAME, API_KEY);

    const params = new URLSearchParams({
      key: API_KEY,
      sign,
      type,
      service,
      target,
      order_id
    });

    const url = `https://vip-reseller.co.id/api/order?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order' });
  }
});

module.exports = router;