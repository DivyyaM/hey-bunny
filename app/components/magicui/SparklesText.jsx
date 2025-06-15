"use client";
import React from "react";

const SparklesText = ({ text }) => {
  return (
    <span className="relative inline-block">
      <span className="relative z-10 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-gradient-x">
        {text}
      </span>
      <span className="absolute inset-0 z-0 pointer-events-none animate-sparkle" />
    </span>
  );
};

export default SparklesText; 