import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

async function getGenerativeAIResponse(prompt) {
  console.log(prompt);

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}

export { getGenerativeAIResponse };
