import React from "react";

// Simple bento grid: 1 large, 3 small (if 4+ images)
const BentoImageGrid = ({ images, onImageClick }) => {
  if (!images || images.length === 0) return null;
  const displayImages = images.slice(0, 4);
  return (
    <div className="w-full aspect-[4/3] grid grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-lg">
      {displayImages.map((img, idx) => (
        <div
          key={idx}
          className={
            idx === 0 && images.length > 1
              ? "row-span-2 col-span-1 cursor-pointer"
              : "row-span-1 col-span-1 cursor-pointer"
          }
          style={{ position: 'relative' }}
          onClick={() => onImageClick(idx)}
        >
          <img
            src={img}
            alt={`Trip ${idx + 1}`}
            className="object-cover w-full h-full hover:brightness-90 transition rounded-lg"
            style={{ height: '100%', width: '100%' }}
          />
          {idx === 3 && images.length > 4 && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-lg font-bold rounded-lg">
              +{images.length - 4}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BentoImageGrid; 