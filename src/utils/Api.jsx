export const callLLM = async (messages = [], { signal } = {}) => {
  const API_KEY = import.meta.env.VITE_LLM_API_KEY;
  let MODEL = import.meta.env.VITE_LLM_MODEL || "gemini-2.0-flash";

  if (!API_KEY) {
    throw new Error("❌ Missing API key in .env");
  }

  const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

  const contents = messages.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  const requestBody = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
    },
  };

  try {
    const res = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
      },
      body: JSON.stringify(requestBody),
      signal,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || `HTTP ${res.status}`);
    }

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  } catch (err) {
    console.error("🔴 API Error:", err.message);
    throw err;
  }
};
