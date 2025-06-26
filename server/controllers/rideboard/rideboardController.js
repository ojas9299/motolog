const Trip = require('../../models/Trip');

/**
 * Get all public (Rideboard) trips
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPublicTrips = async (req, res) => {
  try {
    const publicTrips = await Trip.find({ visibility: "public" }).sort({ sharedAt: -1 });
    res.json({
      success: true,
      data: { trips: publicTrips },
      count: publicTrips.length
    });
  } catch (error) {
    console.error("❌ Error fetching public trips:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch public trips"
    });
  }
};

/**
 * Toggle like for a public trip
 * @route POST /api/rideboard/:id/like
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * Expects: req.body.userId
 */
const toggleLike = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, error: 'Missing userId' });
  }
  try {
    const trip = await Trip.findById(id);
    if (!trip || trip.visibility !== 'public') {
      return res.status(404).json({ success: false, error: 'Public trip not found' });
    }
    const idx = trip.likes.indexOf(userId);
    if (idx === -1) {
      trip.likes.push(userId);
    } else {
      trip.likes.splice(idx, 1);
    }
    await trip.save();
    res.json({ success: true, likes: trip.likes.length, liked: idx === -1 });
  } catch (error) {
    console.error('❌ Error toggling like:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle like' });
  }
};

/**
 * Toggle save for a public trip
 * @route POST /api/rideboard/:id/save
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * Expects: req.body.userId
 */
const toggleSave = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, error: 'Missing userId' });
  }
  try {
    const trip = await Trip.findById(id);
    if (!trip || trip.visibility !== 'public') {
      return res.status(404).json({ success: false, error: 'Public trip not found' });
    }
    const idx = trip.saves.indexOf(userId);
    if (idx === -1) {
      trip.saves.push(userId);
    } else {
      trip.saves.splice(idx, 1);
    }
    await trip.save();
    res.json({ success: true, saves: trip.saves.length, saved: idx === -1 });
  } catch (error) {
    console.error('❌ Error toggling save:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle save' });
  }
};

/**
 * Toggle join for a public trip
 * @route POST /api/rideboard/:id/join
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * Expects: req.body.userId
 */
const toggleJoin = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, error: 'Missing userId' });
  }
  try {
    const trip = await Trip.findById(id);
    if (!trip || trip.visibility !== 'public') {
      return res.status(404).json({ success: false, error: 'Public trip not found' });
    }
    const idx = trip.joins.indexOf(userId);
    if (idx === -1) {
      trip.joins.push(userId);
    } else {
      trip.joins.splice(idx, 1);
    }
    await trip.save();
    res.json({ success: true, joins: trip.joins.length, joined: idx === -1 });
  } catch (error) {
    console.error('❌ Error toggling join:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle join' });
  }
};

/**
 * Add a comment to a public trip
 * @route POST /api/rideboard/:id/comment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * Expects: req.body.userId, req.body.displayName, req.body.text
 */
const addComment = async (req, res) => {
  const { id } = req.params;
  const { userId, displayName, text } = req.body;
  if (!userId || !text) {
    return res.status(400).json({ success: false, error: 'Missing userId or text' });
  }
  try {
    const trip = await Trip.findById(id);
    if (!trip || trip.visibility !== 'public') {
      return res.status(404).json({ success: false, error: 'Public trip not found' });
    }
    const comment = {
      userId,
      displayName: displayName || userId,
      text,
      createdAt: new Date()
    };
    trip.comments.push(comment);
    await trip.save();
    res.json({ success: true, comment });
  } catch (error) {
    console.error('❌ Error adding comment:', error);
    res.status(500).json({ success: false, error: 'Failed to add comment' });
  }
};

/**
 * Delete a comment from a public trip
 * @route DELETE /api/rideboard/:tripId/comment/:commentId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * Expects: req.body.userId
 */
const deleteComment = async (req, res) => {
  const { tripId, commentId } = req.params;
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, error: 'Missing userId' });
  }
  try {
    const trip = await Trip.findById(tripId);
    if (!trip || trip.visibility !== 'public') {
      return res.status(404).json({ success: false, error: 'Public trip not found' });
    }
    // Find the comment by _id (as string)
    const comment = trip.comments.find(c => c._id?.toString() === commentId);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }
    if (comment.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this comment' });
    }
    // Remove the comment using filter
    trip.comments = trip.comments.filter(c => c._id?.toString() !== commentId);
    await trip.save();
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error deleting comment:', error);
    res.status(500).json({ success: false, error: 'Failed to delete comment' });
  }
};

module.exports = {
  getPublicTrips,
  toggleLike,
  toggleSave,
  toggleJoin,
  addComment,
  deleteComment
}; 