import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

const envPath = path.join(REPO_ROOT, ".env");
const envVars = fs.readFileSync(envPath, "utf-8")
  .split("\n").filter(l => l.includes("=") && !l.startsWith("#"))
  .reduce((acc, l) => { const [k,...v]=l.split("="); acc[k.trim()]=v.join("=").trim(); return acc; }, {});

const API_KEY = envVars["OPENROUTER_API_KEY"];

const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://innovationlatam.com",
    "X-Title": "Test"
  },
  body: JSON.stringify({
    model: "google/gemini-3.1-flash-image-preview",
    messages: [{ role: "user", content: "Generate a photorealistic photo of a coffee mug on a wooden desk. Portrait 4:5 ratio." }],
    modalities: ["image"],
    response_modalities: ["image"]
  })
});

const data = await res.json();

console.log("TOP KEYS:", Object.keys(data));
console.log("MESSAGE KEYS:", Object.keys(data.choices[0].message));

const content = data.choices[0].message.content;
console.log("CONTENT TYPE:", typeof content);
console.log("CONTENT IS ARRAY:", Array.isArray(content));

if (Array.isArray(content)) {
  content.forEach((p, i) => {
    console.log(`PART ${i}:`, JSON.stringify(p).slice(0, 300));
  });
} else if (content) {
  console.log("CONTENT (first 300):", String(content).slice(0, 300));
} else {
  console.log("CONTENT IS NULL/UNDEFINED");
}

const msgStr = JSON.stringify(data.choices[0].message);
console.log("Has image_url:", msgStr.includes("image_url"));
console.log("Has inline_data:", msgStr.includes("inline_data"));
console.log("Has data:image:", msgStr.includes("data:image"));

const rd = data.choices[0].message.reasoning_details;
if (rd) {
  rd.forEach((r, i) => {
    console.log(`RD[${i}] type: ${r.type}, keys: ${Object.keys(r).join(", ")}`);
    if (r.type !== "reasoning.encrypted") console.log("  content:", JSON.stringify(r).slice(0, 200));
  });
}

// Save full response (minus base64) to inspect
const safe = JSON.parse(JSON.stringify(data, (k, v) => {
  if (typeof v === "string" && v.length > 500) return `[STRING len=${v.length}]`;
  return v;
}));
console.log("\nFULL STRUCTURE:", JSON.stringify(safe, null, 2));
