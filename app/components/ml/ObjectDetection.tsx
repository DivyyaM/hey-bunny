"use client";
import React, { useRef, useState } from "react";
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';

export default function ObjectDetection() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState<string>("");
  const imgRef = useRef<HTMLImageElement>(null);

  const handleDetect = async () => {
    setLoading(true);
    setResult(null);
    try {
      const model = await cocoSsd.load();
      if (imgRef.current) {
        const predictions = await model.detect(imgRef.current);
        setResult(predictions);
      }
    } catch (err) {
      setResult("Error: " + err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#181818] rounded-lg p-6 border border-gray-700 max-w-lg mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-orange-400">Object Detection (TensorFlow.js)</h2>
      <input
        type="text"
        className="w-full p-2 bg-[#222] text-white rounded border border-gray-600 mb-4"
        placeholder="Paste an image URL here..."
        value={imgUrl}
        onChange={e => setImgUrl(e.target.value)}
      />
      {imgUrl && (
        <img
          ref={imgRef}
          src={imgUrl}
          alt="To detect"
          className="max-w-full max-h-64 mx-auto mb-4 border border-gray-700 rounded"
          crossOrigin="anonymous"
          onError={() => setImgUrl("")}
        />
      )}
      <button
        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-semibold"
        onClick={handleDetect}
        disabled={loading || !imgUrl}
      >
        {loading ? "Detecting..." : "Detect Objects"}
      </button>
      {result && (
        <div className="mt-4 text-base text-gray-200">
          <h3 className="font-semibold mb-2">Results:</h3>
          <pre className="bg-[#222] p-2 rounded text-xs overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
} 