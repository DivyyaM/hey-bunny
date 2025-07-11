"use client";
import React, { useState } from "react";
import * as tf from '@tensorflow/tfjs';

const POSITIVE_WORDS = ["good", "great", "happy", "love", "excellent", "awesome", "fantastic", "positive", "amazing", "wonderful"];
const NEGATIVE_WORDS = ["bad", "sad", "hate", "terrible", "awful", "horrible", "negative", "worst", "angry", "disappoint"];

export default function SentimentAnalysis() {
  const [input, setInput] = useState("");
  const [sentiment, setSentiment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeSentiment = async () => {
    setLoading(true);
    // Simple rule-based fallback
    const text = input.toLowerCase();
    let score = 0;
    POSITIVE_WORDS.forEach(word => { if (text.includes(word)) score++; });
    NEGATIVE_WORDS.forEach(word => { if (text.includes(word)) score--; });
    let label = "Neutral";
    if (score > 0) label = "Positive";
    if (score < 0) label = "Negative";
    // Removed Universal Sentence Encoder usage
    setSentiment(label);
    setLoading(false);
  };

  return (
    <div className="bg-[#181818] rounded-lg p-6 border border-gray-700 max-w-lg mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-pink-400">Sentiment Analysis (TensorFlow.js)</h2>
      <textarea
        className="w-full p-2 bg-[#222] text-white rounded border border-gray-600 mb-4"
        rows={3}
        placeholder="Type your text here..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded font-semibold"
        onClick={analyzeSentiment}
        disabled={loading || !input.trim()}
      >
        {loading ? "Analyzing..." : "Analyze Sentiment"}
      </button>
      {sentiment && (
        <div className="mt-4 text-lg font-semibold">
          Sentiment: {sentiment === "Positive" ? <span className="text-green-400">Positive</span> : sentiment === "Negative" ? <span className="text-red-400">Negative</span> : <span className="text-gray-300">Neutral</span>}
        </div>
      )}
    </div>
  );
} 