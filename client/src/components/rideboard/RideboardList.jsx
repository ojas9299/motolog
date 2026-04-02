import React, { useRef, useCallback } from "react";
import { useRideboard } from "../../hooks/rideboard/useRideboard";
import RideboardCard from "./RideboardCard";
import Spinner from "../ui/Spinner";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Radio, TrendingUp, Trophy, Plus } from "lucide-react";

const RideboardList = () => {
  const { user } = useUser();
  const userId = user?.id;
  const {
    trips,
    loading,
    error,
    likeTrip,
    saveTrip,
    joinTrip,
    commentTrip,
    deleteComment,
    fetchMorePublicTrips,
    hasMore,
  } = useRideboard();
  const [likeLoading, setLikeLoading] = React.useState(null);
  const displayName = user?.fullName || user?.username || user?.firstName || "User";

  const observer = useRef();
  const lastTripRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMorePublicTrips();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchMorePublicTrips]
  );

  const handleDeleteComment = async (tripId, commentId) => {
    if (!userId) return;
    if (!window.confirm("Delete this comment?")) return;
    await deleteComment(tripId, commentId, userId);
  };

  // Shared card props builder
  const buildCardProps = (trip) => {
    const liked = !!userId && trip.likes?.includes(userId);
    const saved = !!userId && trip.saves?.includes(userId);
    const joined = !!userId && trip.joins?.includes(userId);
    const commentCount = trip.comments?.length || 0;
    return {
      trip,
      liked,
      likeCount: trip.likes?.length || 0,
      saved,
      joined,
      commentCount,
      onLike: async () => {
        if (!userId || likeLoading === trip._id) return;
        setLikeLoading(trip._id);
        await likeTrip(trip._id, userId);
        setLikeLoading(null);
      },
      onSave: async () => {
        if (!userId) return;
        await saveTrip(trip._id, userId);
      },
      onJoin: async () => {
        if (!userId) return;
        await joinTrip(trip._id, userId);
      },
      onComment: async (text) => {
        if (!userId || !text || !text.trim()) return;
        await commentTrip(trip._id, userId, text.trim(), displayName);
      },
      onDeleteComment: handleDeleteComment,
      currentUserId: userId,
    };
  };

  // ─── Loading state ───
  if (loading && trips.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  // ─── Error state ───
  if (error) {
    return (
      <div className="max-w-[600px] mx-auto mt-12 p-4 glass-card rounded-xl border border-red-500/20 text-red-400 text-sm font-body">
        Error loading rideboard: {error}
      </div>
    );
  }

  // ─── Empty state ───
  if (!trips.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-hud-bg">
        <div className="glass-card rounded-2xl p-12 flex flex-col items-center gap-4 border border-white/5 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-hud-primary-container/20 flex items-center justify-center">
            <Radio size={28} className="text-indigo-400" />
          </div>
          <h3 className="font-headline font-bold text-lg text-hud-on-surface">No Public Trips Yet</h3>
          <p className="text-sm text-slate-400 text-center font-body">
            Be the first to share a ride! Log a trip and make it public to appear on the Rideboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hud-bg py-6 sm:py-8 px-3 sm:px-6">
      <div className="flex justify-center gap-8">
        {/* ─── Main Feed Column ─── */}
        <div className="w-full max-w-[600px] flex flex-col gap-6 sm:gap-8">
          {/* Page Title */}
          <motion.section
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-2"
          >
            <h2 className="text-3xl font-bold font-headline text-hud-on-surface tracking-tight">
              Rideboard
              <span className="text-slate-500 font-normal text-lg ml-2">(Public Trips)</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.6)] animate-pulse" />
              <p className="text-sm text-slate-400 font-medium font-body">
                {trips.length} ride{trips.length !== 1 ? "s" : ""} shared by the community
              </p>
            </div>
          </motion.section>

          {/* Trip Cards Feed */}
          {trips.map((trip, idx) => {
            const isLast = idx === trips.length - 1;
            return (
              <RideboardCard
                key={trip._id}
                {...buildCardProps(trip)}
                innerRef={isLast ? lastTripRef : undefined}
              />
            );
          })}

          {/* Loading more indicator */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <Spinner />
            </div>
          )}

          {/* End of feed */}
          {!hasMore && trips.length > 0 && (
            <div className="text-center py-8 text-slate-500 text-xs font-label uppercase tracking-widest">
              — End of feed —
            </div>
          )}
        </div>

        {/* ─── Right Contextual Sidebar (Desktop Only) ─── */}
        <aside className="hidden xl:flex flex-col gap-6 w-72 flex-shrink-0 mt-20">
          {/* Trending Routes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-5 border border-white/5"
          >
            <h4 className="text-xs font-bold text-white font-headline uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp size={14} className="text-indigo-400" />
              Trending Routes
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-hud-on-surface">Manali → Leh</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-label uppercase">18 active riders</span>
                  <span className="text-[10px] text-indigo-400 font-label uppercase">+12% surge</span>
                </div>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-hud-on-surface">Coast of Kerala</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-label uppercase">9 active riders</span>
                </div>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-hud-on-surface">Mumbai → Goa</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-label uppercase">14 active riders</span>
                  <span className="text-[10px] text-emerald-400 font-label uppercase">Popular</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Rider Challenge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card rounded-2xl p-5 border border-white/5"
          >
            <h4 className="text-xs font-bold text-white font-headline uppercase tracking-widest mb-4 flex items-center gap-2">
              <Trophy size={14} className="text-amber-400" />
              Rider Challenges
            </h4>
            <div className="bg-hud-primary-container/15 p-4 rounded-xl border border-indigo-500/20">
              <p className="text-sm font-bold text-hud-primary mb-1 font-headline">Iron Butt: 500km</p>
              <p className="text-xs text-slate-400 mb-3 font-body">Complete a 500km single day ride.</p>
              <div className="w-full bg-hud-surface-container-highest rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: "65%",
                    background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
                    boxShadow: "0 0 8px rgba(79,70,229,0.5)",
                  }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-label uppercase tracking-wider">325 / 500 km</p>
            </div>
          </motion.div>
        </aside>
      </div>

      {/* ─── Floating Action Button ─── */}
      <button className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 z-50 group"
        style={{
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          boxShadow: "0 0 30px rgba(79,70,229,0.4)",
        }}
      >
        <Plus size={24} className="text-white group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
};

export default RideboardList;