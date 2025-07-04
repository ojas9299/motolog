import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Calendar, MapPin, Ruler, Star, MessageCircle, Heart, Bookmark, Users, Trash2 } from 'lucide-react';
import BentoImageGrid from "../ui/BentoImageGrid";
import ImageModal from "../ui/ImageModal";

const RideboardCard = ({ trip, onLike, onSave, onJoin, onComment, liked, likeCount, saved, joined, commentCount, continuous, onDeleteComment, currentUserId }) => {
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIdx, setModalIdx] = useState(0);
  const comments = trip.comments || [];
  const commentsToShow = showAllComments ? comments : comments.slice(-2);
  const images = trip.tripImages?.filter(Boolean) || [];

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setCommentLoading(true);
    await onComment(commentInput);
    setCommentInput("");
    setCommentLoading(false);
    setShowAllComments(true); // Show all after adding
  };

  const handleImageClick = (idx) => {
    setModalIdx(idx);
    setModalOpen(true);
  };

  return (
    <section
      className={`w-full bg-white dark:bg-gray-900 ${continuous ? "rounded-none border-b border-gray-200 dark:border-gray-700" : "rounded-2xl shadow-lg"} flex flex-col gap-0 overflow-hidden`}
      style={{ boxShadow: continuous ? "none" : undefined }}
    >
      {/* Image grid or single image */}
      {images.length > 1 ? (
        <BentoImageGrid images={images} onImageClick={handleImageClick} />
      ) : images.length === 1 ? (
        <img
          src={images[0]}
          alt="Trip"
          className="w-full h-96 object-cover cursor-pointer"
          style={{ borderRadius: continuous ? 0 : undefined }}
          onClick={() => handleImageClick(0)}
        />
      ) : null}
      {modalOpen && (
        <ImageModal images={images} startIndex={modalIdx} onClose={() => setModalOpen(false)} />
      )}
      <div className="px-6 pt-4 pb-2 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
          <Calendar size={16} className="text-indigo-400" />
          {trip.startTime && new Date(trip.startTime).toLocaleString()} <span className="mx-1">→</span> {trip.endTime && new Date(trip.endTime).toLocaleString()}
        </div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="font-bold text-indigo-700 dark:text-indigo-200 text-lg flex items-center gap-2">
            {trip.brand} {trip.model}
          </div>
          <span className="text-base font-bold text-indigo-600 dark:text-indigo-100 bg-indigo-50 dark:bg-indigo-800 px-3 py-1 rounded shadow-sm flex items-center gap-2">
            <MapPin size={16} className="text-green-500" />
            {trip.startLocation}
            <span className="mx-1">→</span>
            <MapPin size={16} className="text-red-500" />
            {trip.endLocation}
          </span>
        </div>
        {/* Instagram-style caption */}
        {trip.description && (
          <div className="mb-1 text-base">
            <span className="font-semibold text-indigo-700 dark:text-indigo-200 mr-2">{trip.owner}</span>
            <span className="text-gray-800 dark:text-white">{trip.description}</span>
          </div>
        )}
        <div className="text-sm flex items-center gap-2 mb-1">
          <Ruler size={15} className="text-indigo-400" />
          <span className="font-semibold text-gray-700 dark:text-gray-200">Distance:</span>
          {trip.calculatedDistance ? (
            <span className="font-semibold text-green-600 dark:text-green-400">{trip.calculatedDistance} km</span>
          ) : (
            <span className="text-gray-400 italic">N/A</span>
          )}
        </div>
        {trip.rating && (
          <div className="text-sm flex items-center gap-1 mb-1">
            <Star size={15} className="text-yellow-400" />
            <span className="font-semibold text-gray-700 dark:text-gray-200">Rating:</span>
            <span>{trip.rating}/5</span>
          </div>
        )}
        <div className="flex flex-wrap gap-4 mt-4 mb-2">
          <button
            onClick={onLike}
            className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold transition border-none bg-transparent text-pink-700 hover:bg-pink-50 focus:outline-none ${liked ? "bg-pink-100" : ""}`}
            style={{ boxShadow: "none" }}
          >
            <Heart size={20} fill={liked ? "#ec4899" : "none"} stroke="#ec4899" />
            <span>{likeCount ?? (trip.likes?.length || 0)}</span>
          </button>
          {/* Save and Join buttons are disabled/hidden */}
        </div>
        {/* Comment List */}
        <div className="mt-2">
          {comments.length > 2 && !showAllComments && (
            <button
              className="text-sm text-indigo-600 dark:text-indigo-300 hover:underline mb-2"
              onClick={() => setShowAllComments(true)}
            >
              View all {comments.length} comments
            </button>
          )}
          <div className="flex flex-col gap-2">
            {commentsToShow.map((c, idx) => (
              <div key={idx} className="text-sm flex flex-col relative group">
                <span className="font-semibold text-indigo-700 dark:text-indigo-200 flex items-center">
                  {c.displayName || c.userId}
                  {currentUserId === c.userId && onDeleteComment && (
                    <button
                      type="button"
                      className="ml-2 text-gray-400 hover:text-red-600 opacity-70 group-hover:opacity-100 transition"
                      title="Delete comment"
                      onClick={() => onDeleteComment(trip._id, c._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </span>
                <span className="text-gray-800 dark:text-white">{c.text}</span>
                <span className="text-xs text-gray-400 mt-1">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Add Comment Input */}
        <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 mt-2 border-t border-gray-200 pt-2">
          <input
            type="text"
            className="flex-1 rounded-full px-4 py-2 bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-indigo-400 outline-none text-sm text-gray-900 dark:text-white"
            placeholder="Add a comment..."
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            disabled={commentLoading}
            maxLength={200}
          />
          <button
            type="submit"
            className="text-indigo-600 font-semibold hover:underline disabled:opacity-50"
            disabled={commentLoading || !commentInput.trim()}
          >
            Post
          </button>
        </form>
      </div>
    </section>
  );
};

export default RideboardCard; 