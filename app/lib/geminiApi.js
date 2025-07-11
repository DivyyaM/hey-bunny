// Gemini API utility for frontend use

export async function generateWithGemini({ prompt, apiKey }) {
  if (!apiKey) throw new Error('Gemini API key is required');
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 120,
      topP: 0.95,
      topK: 40
    }
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Gemini API error: ' + res.status);
  const data = await res.json();
  // Return the generated text(s)
  return data.candidates?.map(c => c.content?.parts?.[0]?.text).filter(Boolean) || [];
} 