import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Bookmark,
  Trash2,
  MoreHorizontal,
  MapPin,
  Clock,
  Gauge,
  Send,
} from "lucide-react";
import BentoImageGrid from "../ui/BentoImageGrid";
import ImageModal from "../ui/ImageModal";

// ─── Time-ago helper ───
const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

// ─── Duration helper ───
const formatDuration = (start, end) => {
  if (!start || !end) return null;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  if (diff <= 0) return null;
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
};

const RideboardCard = ({
  trip,
  onLike,
  onSave,
  onJoin,
  onComment,
  liked,
  likeCount,
  saved,
  joined,
  commentCount,
  continuous,
  onDeleteComment,
  currentUserId,
  innerRef,
}) => {
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIdx, setModalIdx] = useState(0);

  const comments = trip.comments || [];
  const commentsToShow = showAllComments ? comments : comments.slice(-2);
  const images = trip.tripImages?.filter(Boolean) || [];
  const duration = formatDuration(trip.startTime, trip.endTime);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setCommentLoading(true);
    await onComment(commentInput);
    setCommentInput("");
    setCommentLoading(false);
    setShowAllComments(true);
  };

  const handleImageClick = (idx) => {
    setModalIdx(idx);
    setModalOpen(true);
  };

  return (
    <motion.article
      ref={innerRef}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-card rounded-2xl overflow-hidden flex flex-col border border-white/5 transition-transform hover:translate-y-[-2px] duration-300"
    >
      {/* ─── Header: User info ─── */}
      <div className="p-4 sm:p-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-hud-primary-container flex items-center justify-center text-white font-bold text-sm border border-indigo-400/30 flex-shrink-0">
            {(trip.owner || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-body">{trip.owner || "Rider"}</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-label">
              {timeAgo(trip.startTime || trip.createdAt)}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* ─── Image Section ─── */}
      <div className="px-4 sm:px-5 pb-4">
        {images.length > 1 ? (
          <div className="rounded-xl overflow-hidden mb-4">
            <BentoImageGrid images={images} onImageClick={handleImageClick} />
          </div>
        ) : images.length === 1 ? (
          <div className="relative rounded-xl overflow-hidden mb-4 group h-48 cursor-pointer" onClick={() => handleImageClick(0)}>
            <img
              src={images[0]}
              alt="Trip"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="text-xl font-black text-white font-headline tracking-tight uppercase italic">
                {trip.startLocation} → {trip.endLocation}
              </p>
            </div>
          </div>
        ) : (
          /* No images — show route as styled header */
          <div className="relative rounded-xl overflow-hidden mb-4 h-32 bg-gradient-to-br from-hud-primary-container/30 to-hud-surface-container-high flex items-end p-4">
            <p className="text-xl font-black text-white font-headline tracking-tight uppercase italic">
              {trip.startLocation || "Start"} → {trip.endLocation || "End"}
            </p>
          </div>
        )}

        {modalOpen && (
          <ImageModal images={images} startIndex={modalIdx} onClose={() => setModalOpen(false)} />
        )}

        {/* ─── Route label (when image already has it overlaid, show nothing extra; otherwise show here) ─── */}
        {images.length !== 1 && (trip.startLocation || trip.endLocation) && images.length > 1 && (
          <div className="mb-3">
            <p className="text-base font-bold text-white font-headline tracking-tight flex items-center gap-2">
              <MapPin size={14} className="text-emerald-400" />
              {trip.startLocation}
              <span className="text-slate-500 mx-1">→</span>
              <MapPin size={14} className="text-red-400" />
              {trip.endLocation}
            </p>
          </div>
        )}

        {/* ─── Description ─── */}
        {trip.description && (
          <div className="mb-3 text-sm">
            <span className="font-semibold text-hud-primary mr-2 font-label">{trip.owner}</span>
            <span className="text-slate-300">{trip.description}</span>
          </div>
        )}

        {/* ─── Stats Grid ─── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-hud-surface-container-high/50 p-3 rounded-xl">
            <p className="text-[10px] text-slate-400 font-label uppercase tracking-widest flex items-center gap-1">
              <Gauge size={10} />Distance
            </p>
            <p className="text-sm font-bold text-hud-primary mt-0.5">
              {trip.calculatedDistance ? `${trip.calculatedDistance} km` : "N/A"}
            </p>
          </div>
          <div className="bg-hud-surface-container-high/50 p-3 rounded-xl">
            <p className="text-[10px] text-slate-400 font-label uppercase tracking-widest flex items-center gap-1">
              <Clock size={10} />Duration
            </p>
            <p className="text-sm font-bold text-hud-primary mt-0.5">
              {duration || "N/A"}
            </p>
          </div>
          <div className="bg-hud-surface-container-high/50 p-3 rounded-xl">
            <p className="text-[10px] text-slate-400 font-label uppercase tracking-widest">Vehicle</p>
            <p className="text-xs font-bold text-hud-primary leading-tight mt-0.5">
              {trip.brand && trip.model ? `${trip.brand} ${trip.model}` : "—"}
            </p>
          </div>
        </div>

        {/* ─── Social Interaction Bar ─── */}
        <div className="flex items-center justify-between py-3 border-t border-white/5">
          <div className="flex items-center gap-5">
            {/* Like */}
            <button
              onClick={onLike}
              className={`flex items-center gap-1.5 transition-all active:scale-90 ${liked ? "text-pink-500" : "text-slate-400 hover:text-pink-500"}`}
            >
              <Heart size={20} fill={liked ? "currentColor" : "none"} />
              <span className="text-xs font-bold font-label">{likeCount ?? (trip.likes?.length || 0)}</span>
            </button>

            {/* Comment count */}
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-all"
            >
              <MessageCircle size={20} />
              <span className="text-xs font-bold font-label">{commentCount || comments.length}</span>
            </button>

            {/* Join */}
            <button
              onClick={onJoin}
              className={`flex items-center gap-1.5 transition-all active:scale-90 ${joined ? "text-cyan-400" : "text-slate-400 hover:text-cyan-400"}`}
            >
              <UserPlus size={20} />
              <span className="text-xs font-bold font-label">{trip.joins?.length || 0}</span>
            </button>
          </div>

          {/* Bookmark */}
          <button
            onClick={onSave}
            className={`transition-all active:scale-90 ${saved ? "text-indigo-400" : "text-slate-400 hover:text-white"}`}
          >
            <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        {/* ─── Comments Section ─── */}
        {comments.length > 0 && (
          <div className="flex flex-col gap-2 pt-3">
            {comments.length > 2 && !showAllComments && (
              <button
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors mb-1 text-left font-label"
                onClick={() => setShowAllComments(true)}
              >
                View all {comments.length} comments
              </button>
            )}
            {commentsToShow.map((c, idx) => (
              <div key={c._id || idx} className="flex gap-2 items-start group">
                <span className="text-xs font-bold text-hud-primary flex-shrink-0 font-label">
                  {c.displayName || c.userId}:
                </span>
                <span className="text-xs text-slate-300 flex-1">{c.text}</span>
                {currentUserId === c.userId && onDeleteComment && (
                  <button
                    type="button"
                    className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                    title="Delete comment"
                    onClick={() => onDeleteComment(trip._id, c._id)}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ─── Add Comment Input ─── */}
        <form onSubmit={handleCommentSubmit} className="mt-4 flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-hud-primary-container flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            {currentUserId ? "Y" : "?"}
          </div>
          <input
            type="text"
            className="flex-1 bg-hud-surface-container-highest/30 border-none rounded-full text-xs text-slate-300 px-4 py-2.5 focus:ring-1 focus:ring-indigo-500/40 placeholder:text-slate-500 outline-none transition-all focus:bg-hud-surface-container-highest/50"
            placeholder="Add a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            disabled={commentLoading}
            maxLength={200}
          />
          <button
            type="submit"
            disabled={commentLoading || !commentInput.trim()}
            className="text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </motion.article>
  );
};

export default RideboardCard;