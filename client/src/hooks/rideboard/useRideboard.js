import { useState, useEffect, useCallback } from 'react';
import { rideboardAPI } from '../../services/api';

export const useRideboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  // Fetch public trips (first page)
  const fetchPublicTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await rideboardAPI.getPublicTrips(1, limit);
      setTrips(response.data.trips || []);
      setPage(1);
      setHasMore(response.data.hasMore !== false && (response.data.trips?.length === limit));
    } catch (err) {
      setError(err.message);
      console.error('Error fetching public trips:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch more trips (next page)
  const fetchMorePublicTrips = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const response = await rideboardAPI.getPublicTrips(nextPage, limit);
      setTrips(prev => [...prev, ...(response.data.trips || [])]);
      setPage(nextPage);
      setHasMore(response.data.hasMore !== false && (response.data.trips?.length === limit));
    } catch (err) {
      setError(err.message);
      console.error('Error fetching more public trips:', err);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    fetchPublicTrips();
  }, [fetchPublicTrips]);

  // Like a trip
  const likeTrip = useCallback(async (tripId, userId) => {
    try {
      const result = await rideboardAPI.toggleLike(tripId, userId);
      setTrips(prev => prev.map(trip =>
        trip._id === tripId
          ? { ...trip, likes: result.liked
              ? [...(trip.likes || []), userId]
              : (trip.likes || []).filter(id => id !== userId)
            }
          : trip
      ));
      return { success: true, liked: result.liked, likes: result.likes };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Save a trip
  const saveTrip = useCallback(async (tripId, userId) => {
    try {
      const result = await rideboardAPI.toggleSave(tripId, userId);
      setTrips(prev => prev.map(trip =>
        trip._id === tripId
          ? { ...trip, saves: result.saved
              ? [...(trip.saves || []), userId]
              : (trip.saves || []).filter(id => id !== userId)
            }
          : trip
      ));
      return { success: true, saved: result.saved, saves: result.saves };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Join a trip
  const joinTrip = useCallback(async (tripId, userId) => {
    try {
      const result = await rideboardAPI.toggleJoin(tripId, userId);
      setTrips(prev => prev.map(trip =>
        trip._id === tripId
          ? { ...trip, joins: result.joined
              ? [...(trip.joins || []), userId]
              : (trip.joins || []).filter(id => id !== userId)
            }
          : trip
      ));
      return { success: true, joined: result.joined, joins: result.joins };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Comment on a trip
  const commentTrip = useCallback(async (tripId, userId, text, displayName) => {
    try {
      const result = await rideboardAPI.addComment(tripId, userId, text, displayName);
      setTrips(prev => prev.map(trip =>
        trip._id === tripId
          ? { ...trip, comments: [...(trip.comments || []), result.comment] }
          : trip
      ));
      return { success: true, comment: result.comment };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Delete a comment
  const deleteComment = useCallback(async (tripId, commentId, userId) => {
    try {
      await rideboardAPI.deleteComment(tripId, commentId, userId);
      setTrips(prev => prev.map(trip =>
        trip._id === tripId
          ? { ...trip, comments: (trip.comments || []).filter(c => c._id !== commentId) }
          : trip
      ));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  return {
    trips,
    loading,
    error,
    fetchPublicTrips,
    fetchMorePublicTrips,
    hasMore,
    likeTrip,
    saveTrip,
    joinTrip,
    commentTrip,
    deleteComment,
  };
}; 