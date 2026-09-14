const express = require('express');
const { getTours, getTourById, createTour, updateTour, deleteTour, seedTours } = require('../controllers/tourController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getTours);
router.get('/seed', seedTours);
router.get('/:id', getTourById);
router.post('/', protect, admin, createTour);
router.put('/:id', protect, admin, updateTour);
router.delete('/:id', protect, admin, deleteTour);

module.exports = router;