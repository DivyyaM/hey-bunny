"use client";
import React from "react";

const Ripple = ({ className = "", ...props }) => {
  return (
    <svg
      className={`absolute w-full h-full ${className}`}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="100" cy="100" r="80" stroke="#fff" strokeWidth="2" opacity="0.2" />
      <circle cx="100" cy="100" r="60" stroke="#fff" strokeWidth="2" opacity="0.3" />
      <circle cx="100" cy="100" r="40" stroke="#fff" strokeWidth="2" opacity="0.4" />
      <circle cx="100" cy="100" r="20" stroke="#fff" strokeWidth="2" opacity="0.5" />
    </svg>
  );
};

export default Ripple; 