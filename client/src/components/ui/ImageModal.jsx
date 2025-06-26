import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageModal = ({ images, startIndex = 0, onClose }) => {
  const [idx, setIdx] = useState(startIndex);
  const total = images.length;

  const goNext = useCallback(() => setIdx(i => (i + 1) % total), [total]);
  const goPrev = useCallback(() => setIdx(i => (i - 1 + total) % total), [total]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, onClose]);

  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <button className="absolute top-6 right-8 text-white text-3xl" onClick={onClose} title="Close"><X size={32} /></button>
      <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl p-2 bg-black bg-opacity-30 rounded-full hover:bg-opacity-60" onClick={goPrev}><ChevronLeft size={32} /></button>
      <img src={images[idx]} alt="Gallery" className="max-h-[95vh] max-w-[98vw] rounded-xl shadow-lg" />
      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl p-2 bg-black bg-opacity-30 rounded-full hover:bg-opacity-60" onClick={goNext}><ChevronRight size={32} /></button>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-lg bg-black bg-opacity-40 px-4 py-1 rounded-full">
        {idx + 1} / {total}
      </div>
    </div>
  );
};

export default ImageModal; 