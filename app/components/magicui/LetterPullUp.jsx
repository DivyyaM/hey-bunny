"use client";
import React from "react";

export const LetterPullup = ({ text }) => (
  <span className="inline-block">
    {text.split("").map((char, i) => (
      <span
        key={i}
        className="inline-block transition-transform duration-300 hover:-translate-y-2"
      >
        {char}
      </span>
    ))}
  </span>
); 