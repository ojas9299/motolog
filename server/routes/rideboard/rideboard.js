const express = require('express');
const router = express.Router();
const rideboardController = require('../../controllers/rideboard/rideboardController');

// GET /api/rideboard/ - Get all public trips
router.get('/', rideboardController.getPublicTrips);
// Toggle like for a public trip
router.post('/:id/like', rideboardController.toggleLike);
// Toggle save for a public trip
router.post('/:id/save', rideboardController.toggleSave);
// Toggle join for a public trip
router.post('/:id/join', rideboardController.toggleJoin);
// Add comment to a public trip
router.post('/:id/comment', rideboardController.addComment);
// Delete comment from a public trip
router.delete('/:tripId/comment/:commentId', rideboardController.deleteComment);

module.exports = router; 