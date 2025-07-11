"use client";
import React, { useState } from "react";
import * as tf from '@tensorflow/tfjs';

export default function KeywordExtraction() {
  const [input, setInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Simple keyword extraction: top N unique words by frequency (excluding stopwords)
  const STOPWORDS = new Set(["the","is","at","which","on","a","an","and","or","in","to","of","for","with","as","by","from","that","this","it","be","are","was","were","has","have","had","but","not","so","if","then","than","too","very"]);

  const extractKeywords = async () => {
    setLoading(true);
    const words = input.toLowerCase().match(/\b\w+\b/g) || [];
    const freq: Record<string, number> = {};
    words.forEach(word => {
      if (!STOPWORDS.has(word)) freq[word] = (freq[word] || 0) + 1;
    });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    setKeywords(sorted.slice(0, 5).map(([word]) => word));
    setLoading(false);
  };

  return (
    <div className="bg-[#181818] rounded-lg p-6 border border-gray-700 max-w-lg mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-green-400">Keyword Extraction (TensorFlow.js)</h2>
      <textarea
        className="w-full p-2 bg-[#222] text-white rounded border border-gray-600 mb-4"
        rows={3}
        placeholder="Type your text here..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
        onClick={extractKeywords}
        disabled={loading || !input.trim()}
      >
        {loading ? "Extracting..." : "Extract Keywords"}
      </button>
      {keywords.length > 0 && (
        <div className="mt-4 text-base text-gray-200">
          <h3 className="font-semibold mb-2">Keywords:</h3>
          <div>{keywords.join(", ")}</div>
        </div>
      )}
    </div>
  );
} 