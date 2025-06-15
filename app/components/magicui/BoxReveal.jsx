"use client";
import React from "react";
import { motion } from "framer-motion";

const BoxReveal = ({ children, boxColor = "#fff", duration = 1 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration }}
      style={{ borderLeft: `4px solid ${boxColor}` }}
      className="pl-4 mb-4"
    >
      {children}
    </motion.div>
  );
};

export default BoxReveal; 