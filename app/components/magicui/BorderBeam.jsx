"use client";
import React from "react";

export const BorderBeam = ({ size = 350, duration = 10, delay = 9 }) => (
  <div
    className="absolute pointer-events-none z-20"
    style={{
      width: size,
      height: size,
      left: `calc(50% - ${size / 2}px)`,
      top: `calc(50% - ${size / 2}px)`,
      animation: `border-beam ${duration}s linear ${delay}s infinite`,
      borderRadius: "50%",
      border: "2px solid #fff",
      opacity: 0.2,
    }}
  />
); 