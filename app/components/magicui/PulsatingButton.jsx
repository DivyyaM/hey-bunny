"use client";
import React from "react";

export const PulsatingButton = ({ children, ...props }) => (
  <button
    {...props}
    className="relative px-6 py-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 animate-pulse"
  >
    {children}
  </button>
); 