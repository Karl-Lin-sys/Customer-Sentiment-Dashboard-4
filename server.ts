import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.post("/api/analyze", async (req, res) => {
  const { reviews } = req.body;

  if (!reviews || typeof reviews !== 'string') {
    return res.status(400).json({ error: "No reviews provided" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Analyze the following customer reviews and generate a sentiment report.
      
      Input Reviews:
      ${reviews}
      
      Requirements:
      1. Analyze the sentiment trend over time. Extract dates if they appear in the text (e.g., "[2024-01-01] review..."). If no dates are found, distribute the reviews logically across a hypothetical 30-day timeline ending today (${new Date().toISOString().split('T')[0]}).
      2. Identify the top 10 most frequent words/phrases for "praises" and "complaints" each.
      3. Write a concise executive summary with the "Top 3 Actionable Areas for Improvement".
      
      Return the data strictly in the following JSON format:
      {
        "trend": [
          { "date": "YYYY-MM-DD", "sentiment": number between -1 and 1, "label": "Brief context" }
        ],
        "wordCloud": {
          "praises": [ { "text": string, "value": number } ],
          "complaints": [ { "text": string, "value": number } ]
        },
        "executiveSummary": "Markdown formatted summary"
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trend: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  sentiment: { type: Type.NUMBER },
                  label: { type: Type.STRING }
                },
                required: ["date", "sentiment", "label"]
              }
            },
            wordCloud: {
              type: Type.OBJECT,
              properties: {
                praises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      value: { type: Type.NUMBER }
                    },
                    required: ["text", "value"]
                  }
                },
                complaints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      value: { type: Type.NUMBER }
                    },
                    required: ["text", "value"]
                  }
                }
              },
              required: ["praises", "complaints"]
            },
            executiveSummary: { type: Type.STRING }
          },
          required: ["trend", "wordCloud", "executiveSummary"]
        }
      }
    });

    const report = JSON.parse(response.text || "{}");
    res.json({ report });
  } catch (error: any) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze reviews" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
