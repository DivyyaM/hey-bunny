"use client";
import React, { useState } from "react";
import nlp from "compromise";
import SentimentAnalysis from '../../components/ml/SentimentAnalysis';
import ImageClassification from '../../components/ml/ImageClassification';
import ObjectDetection from '../../components/ml/ObjectDetection';
import KeywordExtraction from '../../components/ml/KeywordExtraction';
import TextSummarization from '../../components/ml/TextSummarization';
import FaceDetection from '../../components/ml/FaceDetection';
import PoseEstimation from '../../components/ml/PoseEstimation';

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
  const [rewriteStyle, setRewriteStyle] = useState("casual");
  const [rewritten, setRewritten] = useState("");

  // Compromise extraction
  const handleCompromise = () => {
    if (!input) return setCompromiseKeywords([]);
    const doc = nlp(input);
    setCompromiseKeywords(doc.nouns().out("array").slice(0, 5));
  };

  // Rewriter
  const handleRewrite = () => {
    setRewritten(rewriteCaption(input, rewriteStyle as any));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white space-y-8 p-8">
      <h1 className="text-3xl font-bold mb-6">🧪 ML Model Playground</h1>
      <SentimentAnalysis />
      <ImageClassification />
      <ObjectDetection />
      <KeywordExtraction />
      <TextSummarization />
      <FaceDetection />
      <PoseEstimation />
    </div>
  );
} 