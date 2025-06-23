const express = require('express');
const multer = require('multer');
const Transaction = require('../models/transaction');
const authMiddleware = require('./authMiddleware');

const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Auth middleware to protect route
router.use(authMiddleware);

// Submit top up request with proof upload
router.post('/topup', upload.single('bukti'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount } = req.body;
    const bukti = req.file ? req.file.filename : null;

    const transaction = new Transaction({
      userId,
      type: 'topup',
      amount,
      status: 'pending',
      productName: 'Top Up Saldo Manual',
      bukti
    });

    await transaction.save();
    res.json({ message: 'Top up request submitted, tunggu verifikasi admin.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit top up request' });
  }
});

module.exports = router;