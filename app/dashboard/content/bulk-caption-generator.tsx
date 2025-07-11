"use client";
import React, { useState, useEffect } from "react";
import { generateWithGemini } from '../../lib/geminiApi';

const PLATFORMS = ["Instagram", "LinkedIn", "Twitter", "Facebook", "YouTube"];
const TONES = ["Friendly", "Professional", "Witty", "Inspirational", "Casual"];

const STEPS = [
  'Topic',
  'Tone',
  'Platform',
  'Brand Voice',
  'Review & Generate'
];

export default function BulkCaptionGenerator() {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState("");
  const [brand, setBrand] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => typeof window !== 'undefined' ? localStorage.getItem('geminiApiKey') || '' : '');
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
  const [error, setError] = useState<string>("");
  const [bunnyPoints, setBunnyPoints] = useState<number>(() => typeof window !== 'undefined' ? parseInt(localStorage.getItem('bunnyPoints') || '100', 10) : 100);
  const [showNoPoints, setShowNoPoints] = useState(false);
  const [generationCount, setGenerationCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    const today = new Date().toISOString().slice(0, 10);
    const stored = JSON.parse(localStorage.getItem('generationCount') || '{}');
    return stored[today] || 0;
  });
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [isPro, setIsPro] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('isPro') === 'true' : false);

  useEffect(() => {
    // Listen for BunnyPoints updates from other components
    const handler = () => setBunnyPoints(parseInt(localStorage.getItem('bunnyPoints') || '100', 10));
    window.addEventListener('bunnyPointsUpdate', handler);
    return () => window.removeEventListener('bunnyPointsUpdate', handler);
  }, []);

  useEffect(() => {
    // Listen for subscription status updates
    const handler = () => setIsPro(localStorage.getItem('isPro') === 'true');
    window.addEventListener('proStatusUpdate', handler);
    return () => window.removeEventListener('proStatusUpdate', handler);
  }, []);

  function formatCaption(caption: string, platform: string): string {
    if (platform === 'Instagram') {
      // Add hashtags and emojis
      return caption + ' #InstaGood #ContentCreator 🐰✨';
    } else if (platform === 'LinkedIn') {
      // Professional tone, no emojis (basic emoji removal for demo)
      return caption.replace(/[\u2600-\u27BF\u1F600-\u1F6FF]/g, '').replace(/!+/g, '.').replace(/\s+/g, ' ').trim();
    } else if (platform === 'Twitter') {
      // Add hashtags, limit to 280 chars
      let tweet = caption + ' #Trending #AI';
      if (tweet.length > 280) tweet = tweet.slice(0, 277) + '…';
      return tweet;
    } else if (platform === 'Facebook') {
      // Add a call to action
      return caption + ' Like & share if you agree!';
    } else if (platform === 'YouTube') {
      // Add a video-related CTA
      return caption + ' Subscribe for more! 🎥';
    }
    return caption;
  }

  async function generateCaptions() {
    setLoading(true);
    setError("");
    const today = new Date().toISOString().slice(0, 10);
    if (!isPro && generationCount >= 5) {
      setShowSubscribe(true);
      setLoading(false);
      return;
    }
    if (bunnyPoints < 5) {
      setShowNoPoints(true);
      setLoading(false);
      return;
    }
    if (!apiKey) {
      setShowApiKeyPrompt(true);
      setLoading(false);
      return;
    }
    try {
      const prompt = `Generate 15 creative, platform-optimized social media captions and image prompts for the following:\nTopic: ${topic}\nBrand Voice: ${brand}\nTone: ${tone}\nPlatform: ${platform}\nFormat: For each, output a caption and a matching image prompt.`;
      const outputs = await generateWithGemini({ prompt, apiKey });
      const captions = outputs.flatMap((text: string) => {
        return text.split(/\n?\d+\./).map((line: string) => {
          const [caption, ...imgPrompt] = line.split('Image prompt:');
          if (caption.trim()) {
            return {
              caption: formatCaption(caption.trim(), platform),
              imagePrompt: imgPrompt.join('Image prompt:').trim() || ''
            };
          }
          return null;
        }).filter(Boolean);
      }).filter(Boolean);
      setResults(captions.slice(0, 15));
      const history = JSON.parse(localStorage.getItem("bulkCaptionHistory") || "[]");
      localStorage.setItem("bulkCaptionHistory", JSON.stringify([{ topic, brand, tone, platform, results: captions, date: new Date().toISOString() }, ...history]));
      // Deduct BunnyPoints
      const newPoints = bunnyPoints - 5;
      localStorage.setItem('bunnyPoints', newPoints.toString());
      setBunnyPoints(newPoints);
      window.dispatchEvent(new Event('bunnyPointsUpdate'));
      // Increment generation count
      const stored = JSON.parse(localStorage.getItem('generationCount') || '{}');
      stored[today] = (stored[today] || 0) + 1;
      localStorage.setItem('generationCount', JSON.stringify(stored));
      setGenerationCount(stored[today]);
    } catch (err: any) {
      setError("Gemini API error: " + (err.message || err.toString()));
      const captions = Array.from({ length: 15 }, (_, i) => ({
        caption: formatCaption(`${tone} ${platform} caption #${i + 1} for \"${topic}\" (${brand})`, platform),
        imagePrompt: `Image prompt for ${topic} in ${platform} style, ${tone} tone, brand: ${brand}`
      }));
      setResults(captions);
    }
    setLoading(false);
  }

  function handleApiKeySave() {
    if (apiKey) {
      localStorage.setItem('geminiApiKey', apiKey);
      setShowApiKeyPrompt(false);
    }
  }

  function handleUpgrade() {
    localStorage.setItem('isPro', 'true');
    setIsPro(true);
    setShowSubscribe(false);
    window.dispatchEvent(new Event('proStatusUpdate'));
  }

  function nextStep() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function prevStep() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <div className="min-h-screen bg-[#18181b] flex flex-col items-center py-10">
      <div className="bg-[#23233a] p-8 rounded-2xl shadow-lg max-w-2xl w-full border border-[#23233a]">
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${i === step ? 'bg-pink-500' : 'bg-[#18181b] border border-gray-700'}`}>{i + 1}</div>
              {i < STEPS.length - 1 && <div className="w-8 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-1 rounded" />}
            </div>
          ))}
        </div>
        <div className='flex items-center gap-2 mb-4'>
          <span className='text-pink-400 font-bold'>🥕 BunnyPoints:</span>
          <span className='text-white font-bold'>{bunnyPoints}</span>
          {!isPro && (
            <button onClick={() => setShowSubscribe(true)} className='ml-2 px-2 py-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white rounded text-xs hover:scale-105 transition'>Upgrade to Pro</button>
          )}
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Bulk Caption & Image Prompt Generator</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={e => {
            e.preventDefault();
            if (step === STEPS.length - 1) {
              generateCaptions();
            } else {
              nextStep();
            }
          }}
        >
          {step === 0 && (
            <input
              className="p-3 rounded bg-[#18181b] text-white border border-gray-700"
              placeholder="Topic or Niche (e.g. AI for Creators)"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              required
            />
          )}
          {step === 1 && (
            <select
              className="p-3 rounded bg-[#18181b] text-white border border-gray-700"
              value={tone}
              onChange={e => setTone(e.target.value)}
            >
              {TONES.map(t => <option key={t}>{t}</option>)}
            </select>
          )}
          {step === 2 && (
            <select
              className="p-3 rounded bg-[#18181b] text-white border border-gray-700"
              value={platform}
              onChange={e => setPlatform(e.target.value)}
            >
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
          )}
          {step === 3 && (
            <input
              className="p-3 rounded bg-[#18181b] text-white border border-gray-700"
              placeholder="Brand Voice (e.g. Playful, Corporate, Personal)"
              value={brand}
              onChange={e => setBrand(e.target.value)}
              required
            />
          )}
          {step === 4 && (
            <div className="bg-[#18181b] p-4 rounded-lg text-white border border-gray-700">
              <div className="mb-2"><b>Topic:</b> {topic}</div>
              <div className="mb-2"><b>Tone:</b> {tone}</div>
              <div className="mb-2"><b>Platform:</b> {platform}</div>
              <div className="mb-2"><b>Brand Voice:</b> {brand}</div>
            </div>
          )}
          <div className="flex gap-4 mt-2">
            {step > 0 && <button type="button" className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition" onClick={prevStep}>Back</button>}
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white font-bold py-2 px-4 rounded-lg hover:scale-105 transition"
              disabled={loading}
            >
              {step === STEPS.length - 1 ? (loading ? "Generating..." : "Generate 15+ Captions & Prompts") : "Next"}
            </button>
          </div>
        </form>
        {error && <div className="mt-4 text-red-400 text-sm">{error}</div>}
      </div>
      {showApiKeyPrompt && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#23233a] p-8 rounded-2xl shadow-lg max-w-md w-full border border-[#23233a] flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white mb-2">Enter your Gemini API Key</h2>
            <input
              className="p-3 rounded bg-[#18181b] text-white border border-gray-700"
              placeholder="Paste your Gemini API key here"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
            <button
              className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white font-bold py-2 rounded-lg mt-2 hover:scale-105 transition"
              onClick={handleApiKeySave}
            >
              Save API Key
            </button>
            <button
              className="text-gray-400 underline text-xs mt-2"
              onClick={() => setShowApiKeyPrompt(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showNoPoints && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#23233a] p-8 rounded-2xl shadow-lg max-w-md w-full border border-[#23233a] flex flex-col gap-4 items-center">
            <h2 className="text-xl font-bold text-white mb-2">Not enough BunnyPoints!</h2>
            <p className="text-gray-300 mb-2">You need at least 5 BunnyPoints to generate captions.</p>
            <button
              className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white font-bold py-2 px-4 rounded-lg mt-2 hover:scale-105 transition"
              onClick={() => setShowNoPoints(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showSubscribe && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#23233a] p-8 rounded-2xl shadow-lg max-w-md w-full border border-[#23233a] flex flex-col gap-4 items-center">
            <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Bunny Pro 🥕</h2>
            <p className="text-gray-300 mb-2 text-center">You’ve reached your daily limit of 5 generations.<br/>Upgrade to Pro for unlimited access and premium features!</p>
            <button
              className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white font-bold py-2 px-4 rounded-lg mt-2 hover:scale-105 transition"
              onClick={handleUpgrade}
            >
              Upgrade Now (Demo)
            </button>
            <button
              className="text-gray-400 underline text-xs mt-2"
              onClick={() => setShowSubscribe(false)}
            >
              Not now
            </button>
          </div>
        </div>
      )}
      {results.length > 0 && (
        <div className="mt-10 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-4">Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((r, i) => (
              <div key={i} className="bg-[#23233a] rounded-xl p-5 border border-[#282846] shadow-md text-white">
                <div className="font-semibold text-lg mb-2">{r.caption}</div>
                <div className="text-pink-400 text-sm mb-1">Image Prompt:</div>
                <div className="text-gray-300 text-sm">{r.imagePrompt}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 