'use client'

import React, { useState, useEffect } from "react"
import { chatSession } from '@/utils/AiModal'
import axios from "axios"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import nlp from 'compromise';

export default function PostGenerator() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [caption, setCaption] = useState("")
  const [selectedImage, setSelectedImage] = useState("")
  const [keywords, setKeywords] = useState<string[]>([]);
  const [rewriteStyle, setRewriteStyle] = useState<'casual' | 'seo' | 'professional'>('casual');
  const [engagement, setEngagement] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [emojis, setEmojis] = useState<string[]>([]);
  const [captionFeedback, setCaptionFeedback] = useState<{ up: number; down: number }>({ up: 0, down: 0 });
  const [rewriteFeedback, setRewriteFeedback] = useState<{ up: number; down: number }>({ up: 0, down: 0 });
  const candidateLabels = [
    'Food', 'Fitness', 'Travel', 'Fashion', 'Tech', 'Nature', 'Art', 'Music', 'Sports', 'Love', 'Business', 'Education', 'Health', 'Finance', 'Entertainment', 'Science', 'Politics', 'History', 'Animals', 'DIY'
  ];

  // Simple tag and emoji mapping
  const TAG_EMOJI_MAP: Record<string, string[]> = {
    Food: ['🍔', '🍕', '🍟'],
    Fitness: ['💪', '🏋️‍♂️', '🏃‍♂️'],
    Travel: ['✈️', '🌍', '🏝️'],
    Fashion: ['👗', '👠', '🕶️'],
    Tech: ['💻', '📱', '🤖'],
    Nature: ['🌳', '🌸', '🌞'],
    Art: ['🎨', '🖌️', '🖼️'],
    Music: ['🎵', '🎸', '🎤'],
    Sports: ['⚽', '🏀', '🏈'],
    Love: ['❤️', '😍', '😘'],
  };
  const TAG_KEYWORDS: Record<string, string[]> = {
    Food: ['food', 'pizza', 'burger', 'recipe', 'eat', 'cooking'],
    Fitness: ['fitness', 'workout', 'gym', 'run', 'exercise', 'health'],
    Travel: ['travel', 'trip', 'vacation', 'explore', 'adventure', 'journey'],
    Fashion: ['fashion', 'style', 'outfit', 'clothes', 'trend'],
    Tech: ['tech', 'gadget', 'app', 'software', 'device', 'ai', 'robot'],
    Nature: ['nature', 'tree', 'flower', 'sun', 'mountain', 'beach'],
    Art: ['art', 'painting', 'draw', 'gallery', 'artist'],
    Music: ['music', 'song', 'band', 'guitar', 'sing'],
    Sports: ['sport', 'game', 'soccer', 'basketball', 'football'],
    Love: ['love', 'romance', 'date', 'heart', 'crush'],
  };

  const router = useRouter();

  
  const handleGenerate = async () => {
    setLoading(true)
    setImages([])
    setCaption("")

    try {
      const unsplashResponse = await axios.get("https://api.unsplash.com/search/photos", {
        params: {
          query: prompt,
          per_page: 4,
          orientation: "landscape"
        },
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
        }
      })

      const imageUrls = unsplashResponse.data.results.map((image: any) => image.urls.regular)
      setImages(imageUrls)

      const FinalAIPrompt = prompt + ", " + "Generate only one instagram post caption in the given context"
      const result = await chatSession.sendMessage(FinalAIPrompt)

      setCaption(result?.response.text())
      // --- NLP: Extract keywords from the caption ---
      if (result?.response.text()) {
        const doc = nlp(result.response.text());
        // Get top nouns as keywords
        const nouns = doc.nouns().out('array');
        setKeywords(nouns.slice(0, 5));
      } else {
        setKeywords([]);
      }
    } catch (error) {
      console.error("Error fetching images or caption:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(e.target.value)
  }

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(caption)
    alert("Caption copied to clipboard!")
  }

  const handleCreatePost = () => {
    // Navigate to publish-post with selected image and caption
    router.push(`/publish-post?url=${selectedImage}&caption=${caption}`);
  }

  // Simple rules-based rewriter for demo
  function rewriteCaption(text: string, style: 'casual' | 'seo' | 'professional') {
    if (!text) return '';
    if (style === 'casual') {
      return text + ' 😎✨';
    } else if (style === 'seo') {
      return text + ' | Boost your reach with #trending #viral #mustsee';
    } else if (style === 'professional') {
      return 'Professional: ' + text.replace(/!+/g, '.') + ' Connect with us for more insights.';
    }
    return text;
  }

  const handleRewrite = () => {
    setCaption(rewriteCaption(caption, rewriteStyle));
  };

  // Simple engagement predictor
  function predictEngagement(text: string, keywords: string[]) {
    if (!text) return '';
    let score = 0;
    if (text.length > 100) score += 1;
    if (keywords.length > 3) score += 1;
    if (/[\u263a-\u2764\u1F600-\u1F64F]/.test(text)) score += 1; // Emoji presence (broad unicode range)
    if (score === 0) return 'Low';
    if (score === 1) return 'Medium';
    return 'High';
  }

  // Update engagement when caption or keywords change
  useEffect(() => {
    setEngagement(predictEngagement(caption, keywords));
  }, [caption, keywords]);

  // Tag and emoji assignment
  useEffect(() => {
    if (!caption) {
      setTags([]);
      setEmojis([]);
      return;
    }
    const foundTags: string[] = [];
    const foundEmojis: string[] = [];
    const lower = caption.toLowerCase();
    Object.entries(TAG_KEYWORDS).forEach(([tag, keywords]) => {
      if (keywords.some(word => lower.includes(word))) {
        foundTags.push(tag);
        foundEmojis.push(...(TAG_EMOJI_MAP[tag] || []));
      }
    });
    setTags(foundTags.slice(0, 2));
    setEmojis(foundEmojis.slice(0, 3));
  }, [caption]);

  // Load feedback from localStorage on mount
  useEffect(() => {
    const cap = localStorage.getItem('captionFeedback');
    const rew = localStorage.getItem('rewriteFeedback');
    if (cap) setCaptionFeedback(JSON.parse(cap));
    if (rew) setRewriteFeedback(JSON.parse(rew));
  }, []);

  // Save feedback to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('captionFeedback', JSON.stringify(captionFeedback));
  }, [captionFeedback]);
  useEffect(() => {
    localStorage.setItem('rewriteFeedback', JSON.stringify(rewriteFeedback));
  }, [rewriteFeedback]);

  const handleCaptionFeedback = (type: 'up' | 'down') => {
    setCaptionFeedback(fb => ({ ...fb, [type]: fb[type] + 1 }));
  };
  const handleRewriteFeedback = (type: 'up' | 'down') => {
    setRewriteFeedback(fb => ({ ...fb, [type]: fb[type] + 1 }));
  };

  // Helper: Cosine similarity
  function cosineSimilarity(a: number[], b: number[]) {
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    return dot / (normA * normB);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 space-y-8">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse mb-8">
        AI Post Generator
      </h1>

      <div className="w-full max-w-2xl flex flex-col space-y-6">
        <div className="w-full bg-[#1e1e1e] border border-gray-600 rounded-lg p-4 transition-all duration-300 ease-in-out">
            <textarea
              className="w-full p-2 text-gray-200 bg-[#121212] border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 resize-none transition-all duration-300 ease-in-out"
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full mt-2 py-2 px-4 rounded-md text-white font-semibold transition-all duration-300 ease-in-out ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate"
              )}
            </button>
          </div>

          <div className="w-full bg-[#1e1e1e] border border-gray-600 rounded-lg p-4 transition-all duration-300 ease-in-out">
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : caption ? (
              <div className="space-y-2">
                <textarea
                  className="w-full p-2 bg-[#121212] text-gray-300 border-none focus:outline-none resize-none rounded-md transition-all duration-300 ease-in-out"
                  value={caption}
                  onChange={handleCaptionChange}
                  rows={3}
                />
                {/* --- Engagement Prediction --- */}
                {engagement && (
                  <div className={`text-sm font-semibold mt-1 ${engagement === 'High' ? 'text-green-400' : engagement === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                    Engagement: {engagement}
                  </div>
                )}
                {/* --- Tagging & Emoji Generation --- */}
                {(tags.length > 0 || emojis.length > 0) && (
                  <div className="mt-2 flex items-center gap-4">
                    {tags.length > 0 && (
                      <span className="text-sm text-blue-300">Tags: {tags.join(', ')}</span>
                    )}
                    {emojis.length > 0 && (
                      <span className="text-xl">{emojis.join(' ')}</span>
                    )}
                  </div>
                )}
                <button
                  onClick={handleCopyCaption}
                  className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold text-sm transition-all duration-300 ease-in-out"
                >
                  Copy
                </button>
                {/* --- NLP: Show compromise keywords --- */}
                {keywords.length > 0 && (
                  <div className="mt-2 text-sm text-gray-400">
                    <span className="font-semibold text-white">Keywords (compromise):</span> {keywords.join(', ')}
                  </div>
                )}
                {/* --- Caption Rewriting --- */}
                <div className="mt-4 flex items-center gap-2">
                  <label htmlFor="rewrite-style" className="text-sm text-gray-300">Rewrite style:</label>
                  <select
                    id="rewrite-style"
                    value={rewriteStyle}
                    onChange={e => setRewriteStyle(e.target.value as any)}
                    className="bg-[#222] text-white rounded px-2 py-1 text-sm"
                  >
                    <option value="casual">Casual</option>
                    <option value="seo">SEO</option>
                    <option value="professional">Professional</option>
                  </select>
                  <button
                    onClick={handleRewrite}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                  >
                    Rewrite Caption
                  </button>
                </div>
                {/* --- Feedback Loop --- */}
                <div className="mt-4 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleCaptionFeedback('up')} className="text-green-400 text-xl">👍</button>
                    <button onClick={() => handleCaptionFeedback('down')} className="text-red-400 text-xl">👎</button>
                    <span className="text-xs text-gray-400">{captionFeedback.up} 👍 / {captionFeedback.down} 👎</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">Generated caption will appear here</div>
            )}
          </div>
        <div className="w-full bg-[#121212] border border-gray-600 rounded-lg p-4 transition-all duration-300 ease-in-out">
          <div className="grid grid-cols-4 gap-4">
            {loading
              ? Array(4).fill(0).map((_, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gray-700 animate-pulse"></div>
                  </div>
                ))
              : images.length > 0
              ? images.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out ${
                      selectedImage === image
                        ? "ring-2 ring-blue-500 shadow-[0_0_10px_4px_rgba(0,191,255,0.6)]"
                        : "hover:scale-105"
                    }`}
                    onClick={() => handleSelectImage(image)}
                  >
                    <Image
                      src={image}
                      alt={`Generated Image ${index + 1}`}
                      width={250}
                      height={250}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              : Array(4).fill(0).map((_, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleCreatePost}
        className="mt-6 py-2 px-6 bg-green-500 hover:bg-green-600 text-white rounded-md font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600"
      >
        Create Post
      </button>
    </div>
  )
}