import React from "react";
import { useRideboard } from "../../hooks/rideboard/useRideboard";
import RideboardCard from "./RideboardCard";
import Spinner from "../ui/Spinner";
import { useUser } from "@clerk/clerk-react";

const RideboardList = () => {
  const { user } = useUser();
  const userId = user?.id;
  const { trips, loading, error, likeTrip, saveTrip, joinTrip, commentTrip, deleteComment } = useRideboard();
  const [likeLoading, setLikeLoading] = React.useState(null);
  const displayName = user?.fullName || user?.username || user?.firstName || "User";

  const handleDeleteComment = async (tripId, commentId) => {
    if (!userId) return;
    if (!window.confirm('Delete this comment?')) return;
    await deleteComment(tripId, commentId, userId);
  };

  if (loading) return <Spinner size="lg" className="my-8" />;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded">Error: {error}</div>;
  if (!trips.length) return <div className="p-4 text-gray-500">No public trips on Rideboard yet.</div>;

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-50 py-8">
      <h2 className="text-3xl font-bold mb-8 text-indigo-700">Rideboard (Public Trips)</h2>
      <div className="w-full max-w-xl flex flex-col gap-8">
        {trips.map(trip => {
          const liked = !!userId && trip.likes?.includes(userId);
          const saved = !!userId && trip.saves?.includes(userId);
          const joined = !!userId && trip.joins?.includes(userId);
          const commentCount = trip.comments?.length || 0;
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
        })}
      </div>
    </div>
  );
};

export default RideboardList; 