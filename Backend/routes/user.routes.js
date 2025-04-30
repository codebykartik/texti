const express = require('express');
const router = express.Router();
const { 
  updateProfile, 
  updatePassword, 
  updatePreferences 
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');

router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.put('/preferences', protect, updatePreferences);

module.exports = router;