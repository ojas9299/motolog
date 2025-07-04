import React from "react";

const Footer = () => (
  <footer className="w-full py-6 sm:py-8 bg-neutral-950/90 border-t border-neutral-800 text-center text-indigo-200 text-xs sm:text-sm">
    <div className="max-w-xs xs:max-w-sm sm:max-w-2xl lg:max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 px-2 sm:px-4">
      <span>© {new Date().getFullYear()} Motolog. All rights reserved.</span>
      <span>Made by Ojas <span className="text-pink-400">♥</span></span>
    </div>
  </footer>
);

export default Footer; 