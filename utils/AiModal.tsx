const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('Google Gemini API key is not configured. Please set NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY environment variable.');
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  // Create a safe chat session with error handling
  type ChatSession = {
    sendMessage: (message: string) => Promise<any>;
  };
  
  let chatSession: ChatSession;
  
  try {
    chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [],
    }) as ChatSession;
  } catch (error) {
    console.error('Failed to initialize chat session:', error);
    // Create a fallback chat session
    chatSession = {
      sendMessage: async (message: string) => {
        throw new Error('Chat session not properly initialized. Please check your API key configuration.');
      }
    };
  }
  
  export { chatSession };
  
   
  
  
 