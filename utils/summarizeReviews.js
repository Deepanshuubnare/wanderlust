// main.js
 require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const prompt = "Summarize the following text into exactly 2 lines, capturing the key information clearly and concisely";

const summarizeText = async (rawText) => {
 try {
   const result = await model.generateContent(prompt + rawText);
 const response = await result.response.text();
    console.log("Summary:", response);
    return response;
 }catch(error){
  console.log("error:",error)
  return "Error generating summary.";
 }
}
module.exports = summarizeText;
// summarizeText();


















// const axios = require("axios");
// require("dotenv").config();

// const summarizeText = async (rawText) => {
//   if (!rawText || rawText.trim().length < 10) {
//     return "Not enough review content to summarize.";
//   }

//   const apiUrl = "https://api-inference.huggingface.co/models/google/pegasus-xsum";

//   try {
//     const response = await axios.post(
//       apiUrl,
//       { inputs: rawText },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           ...(process.env.AI_API && { Authorization: `Bearer ${process.env.AI_API}` }),
//         },
//       }
//     );
    
//     const summary = response.data[0]?.summary_text || "";
//     console.log("✅ Pegasus AI Summary Output:", summary);

//     return summary.length >= 10 ? summary.trim() : "AI summary could not be generated.";
//   } catch (error) {
//     console.error("❌ HuggingFace Pegasus Error:", error?.response?.data || error.message);
//     return "Error generating summary.";
//   }
// };

// module.exports = summarizeText;
