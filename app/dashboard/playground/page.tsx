"use client";
import React, { useState } from "react";
import nlp from "compromise";
import { pipeline } from "@xenova/transformers";

const rewriteCaption = (text: string, style: string) => {
  if (!text) return "";
  if (style === "casual") {
    return text + " 😎✨";
  } else if (style === "seo") {
    return text + " | Boost your reach with #trending #viral #mustsee";
  } else if (style === "professional") {
    return (
      "Professional: " + text.replace(/!+/g, ".") + " Connect with us for more insights."
    );
  }
  return text;
};

export default function Playground() {
  const [input, setInput] = useState("");
  const [compromiseKeywords, setCompromiseKeywords] = useState<string[]>([]);
  const [bertKeywords, setBertKeywords] = useState<string[]>([]);
  const [bertLoading, setBertLoading] = useState(false);
  const [rewriteStyle, setRewriteStyle] = useState("casual");
  const [rewritten, setRewritten] = useState("");

  // Compromise extraction
  const handleCompromise = () => {
    if (!input) return setCompromiseKeywords([]);
    const doc = nlp(input);
    setCompromiseKeywords(doc.nouns().out("array").slice(0, 5));
  };

  // BERT extraction
  const handleBert = async () => {
    if (!input) return setBertKeywords([]);
    setBertLoading(true);
    try {
      const ner = await pipeline("ner", "Xenova/bert-base-NER");
      const result = await ner(input);
      const unique = Array.from(new Set(result.map((ent: any) => ent.word.replace(/^##/, ""))));
      setBertKeywords(unique);
    } catch {
      setBertKeywords(["Error extracting keywords"]);
    }
    setBertLoading(false);
  };

  // Rewriter
  const handleRewrite = () => {
    setRewritten(rewriteCaption(input, rewriteStyle as any));
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🧪 Model Playground</h1>
      <p className="mb-4 text-gray-400">Compare outputs from compromise, BERT, and the rewriter side-by-side.</p>
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <textarea
          className="w-full md:w-1/2 p-2 bg-[#121212] text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 resize-none"
          placeholder="Enter a caption to analyze..."
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={3}
        />
        <div className="flex flex-col gap-2">
          <button
            onClick={handleCompromise}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
          >
            Extract (compromise)
          </button>
          <button
            onClick={handleBert}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs"
            disabled={bertLoading}
          >
            {bertLoading ? "Extracting..." : "Extract (BERT)"}
          </button>
          <div className="flex items-center gap-2">
            <select
              value={rewriteStyle}
              onChange={e => setRewriteStyle(e.target.value)}
              className="bg-[#222] text-white rounded px-2 py-1 text-xs"
            >
              <option value="casual">Casual</option>
              <option value="seo">SEO</option>
              <option value="professional">Professional</option>
            </select>
            <button
              onClick={handleRewrite}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
            >
              Rewrite
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-[#181818] rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-semibold mb-2 text-blue-300">Compromise</h2>
          <div className="text-sm text-gray-300">Keywords:</div>
          <div className="text-base mt-1">{compromiseKeywords.join(", ") || <span className="text-gray-500">(none)</span>}</div>
        </div>
        <div className="bg-[#181818] rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-semibold mb-2 text-purple-300">BERT (transformers.js)</h2>
          <div className="text-sm text-gray-300">Entities/Keywords:</div>
          <div className="text-base mt-1">{bertKeywords.join(", ") || <span className="text-gray-500">(none)</span>}</div>
        </div>
        <div className="bg-[#181818] rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-semibold mb-2 text-green-300">Rewriter</h2>
          <div className="text-sm text-gray-300">Rewritten Caption:</div>
          <div className="text-base mt-1">{rewritten || <span className="text-gray-500">(none)</span>}</div>
        </div>
      </div>
    </div>
  );
} 