import React, { useRef, useCallback } from "react";
import { useRideboard } from "../../hooks/rideboard/useRideboard";
import RideboardCard from "./RideboardCard";
import Spinner from "../ui/Spinner";
import { useUser } from "@clerk/clerk-react";

const RideboardList = () => {
  const { user } = useUser();
  const userId = user?.id;
  const { trips, loading, error, likeTrip, saveTrip, joinTrip, commentTrip, deleteComment, fetchMorePublicTrips, hasMore } = useRideboard();
  const [likeLoading, setLikeLoading] = React.useState(null);
  const displayName = user?.fullName || user?.username || user?.firstName || "User";

  const observer = useRef();
  const lastTripRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMorePublicTrips();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, fetchMorePublicTrips]);

  const handleDeleteComment = async (tripId, commentId) => {
    if (!userId) return;
    if (!window.confirm('Delete this comment?')) return;
    await deleteComment(tripId, commentId, userId);
  };

  if (loading && trips.length === 0) return <div className="flex justify-center items-center min-h-[60vh]"><Spinner /></div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded">Error: {error}</div>;
  if (!trips.length) return <div className="p-4 text-gray-500">No public trips on Rideboard yet.</div>;

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-2 sm:px-0">
      <h2 className="text-3xl font-bold mb-8 text-indigo-700 dark:text-indigo-200">Rideboard (Public Trips)</h2>
      <div className="w-full max-w-xl flex flex-col gap-4 sm:gap-8">
        {trips.map((trip, idx) => {
          const liked = !!userId && trip.likes?.includes(userId);
          const saved = !!userId && trip.saves?.includes(userId);
          const joined = !!userId && trip.joins?.includes(userId);
          const commentCount = trip.comments?.length || 0;
          if (idx === trips.length - 1) {
            return (
              <div ref={lastTripRef} key={trip._id}>
                <RideboardCard
                  trip={trip}
                  liked={liked}
                  likeCount={trip.likes?.length || 0}
                  saved={saved}
                  joined={joined}
                  commentCount={commentCount}
                  onLike={async () => {
                    if (!userId || likeLoading === trip._id) return;
                    setLikeLoading(trip._id);
                    await likeTrip(trip._id, userId);
                    setLikeLoading(null);
                  }}
                  onSave={async () => {
                    if (!userId) return;
                    await saveTrip(trip._id, userId);
                  }}
                  onJoin={async () => {
                    if (!userId) return;
                    await joinTrip(trip._id, userId);
                  }}
                  onComment={async (text) => {
                    if (!userId || !text || !text.trim()) return;
                    await commentTrip(trip._id, userId, text.trim(), displayName);
                  }}
                  onDeleteComment={handleDeleteComment}
                  currentUserId={userId}
                  continuous
                />
              </div>
            );
          } else {
            return (
              <RideboardCard
                key={trip._id}
                trip={trip}
                liked={liked}
                likeCount={trip.likes?.length || 0}
                saved={saved}
                joined={joined}
                commentCount={commentCount}
                onLike={async () => {
                  if (!userId || likeLoading === trip._id) return;
                  setLikeLoading(trip._id);
                  await likeTrip(trip._id, userId);
                  setLikeLoading(null);
                }}
                onSave={async () => {
                  if (!userId) return;
                  await saveTrip(trip._id, userId);
                }}
                onJoin={async () => {
                  if (!userId) return;
                  await joinTrip(trip._id, userId);
                }}
                onComment={async (text) => {
                  if (!userId || !text || !text.trim()) return;
                  await commentTrip(trip._id, userId, text.trim(), displayName);
                }}
                onDeleteComment={handleDeleteComment}
                currentUserId={userId}
                continuous
              />
            );
          }
        })}
        {loading && <div className="flex justify-center items-center py-6"><Spinner /></div>}
      </div>
    </div>
  );
};

export default RideboardList; 