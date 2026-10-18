import "dotenv/config";
import OpenAI from "openai";

type DeveloperProfile = {
  name: string;
  yearsOfExperience: number;
  technologies: string[];
  targetRole?: string;
};

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY");
}

const client = new OpenAI({
  apiKey,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function assessDeveloper(
  profile: DeveloperProfile
): Promise<string> {
  const response = await client.chat.completions.create({
  model: process.env.GEMINI_MODEL ?? "gemini-3.8-flash",
  messages: [
    { role: "user", content: `For the given developer profile, assess suitability for the supplied target role.
Use only the evidence in the supplied profile.
Identify missing information instead of inventing experience. ${profile.name}, ${profile.yearsOfExperience} years of experience, skilled in ${profile.technologies.join(", ")}. Target role: ${profile.targetRole || "Not specified"}` },
  ],
});
  return response.choices[0]?.message.content || "No assessment available.";
}


assessDeveloper({
  name: "John Doe",
  yearsOfExperience: 5,
  technologies: [ "JavaScript", "TypeScript" ],
  targetRole: "Kubernetes Engineer"
})
  .then((assessment) => {
    console.log("Assessment:", assessment); 
  });