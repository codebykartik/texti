const express = require('express');
const router = express.Router();
const {
  transformText,
  getTransformationHistory,
  getSingleTransformation,
  saveTransformation,
  deleteTransformation,
  getTransformationStats
} = require('../controllers/transform.controller');
const { protect } = require('../middleware/auth');

// Transform text route - handles all types (standard, email, insights)
router.post('/text', protect, transformText);

// Get transformation history
router.get('/history', protect, getTransformationHistory);

// Get transformation statistics
router.get('/stats', protect, getTransformationStats); 

// Get single transformation
router.get('/:id', protect, getSingleTransformation);

// Save/unsave transformation
router.put('/:id/save', protect, saveTransformation);

// Delete transformation
router.delete('/:id', protect, deleteTransformation);

module.exports = router;