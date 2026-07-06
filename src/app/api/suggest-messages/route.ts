import { createOllama } from "ai-sdk-ollama";
import { streamText, smoothStream } from "ai";

export async function POST(req: Request) {
  const ollama = createOllama({
    apiKey: process.env.OLLAMA_API_KEY,
    baseURL: "https://ollama.com",
  });
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = streamText({
      model: ollama("phi3"),
      prompt,
      experimental_transform: smoothStream({
        delayInMs: 50, // 50ms between chunks
        chunking: "word", // 'word' | 'line' | RegExp
      }),
    });

    for await (const chunk of result.textStream) {
      process.stdout.write(chunk); // Smooth, word-by-word output
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
