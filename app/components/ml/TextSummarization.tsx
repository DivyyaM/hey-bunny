"use client";
import React, { useState } from "react";

export default function TextSummarization() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Simple extractive summarization: return the first 2 sentences
  const summarize = () => {
    setLoading(true);
    const sentences = input.match(/[^.!?]+[.!?]+/g) || [];
    setSummary(sentences.slice(0, 2).join(" ").trim() || input);
    setLoading(false);
  };

  return (
    <div className="bg-[#181818] rounded-lg p-6 border border-gray-700 max-w-lg mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-yellow-400">Text Summarization (Demo)</h2>
      <textarea
        className="w-full p-2 bg-[#222] text-white rounded border border-gray-600 mb-4"
        rows={4}
        placeholder="Paste or type your text here..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded font-semibold"
        onClick={summarize}
        disabled={loading || !input.trim()}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>
      {summary && (
        <div className="mt-4 text-base text-gray-200">
          <h3 className="font-semibold mb-2">Summary:</h3>
          <div>{summary}</div>
        </div>
      )}
    </div>
  );
} 