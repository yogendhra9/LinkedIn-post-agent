// llm.js - LangChain + Ollama setup for generating LinkedIn post
import { Ollama } from "@langchain/ollama";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

const llm = new Ollama({
  baseUrl: "http://localhost:11434", // make sure Ollama is running locally
  model: "llama3", // or "mistral" or "codellama" depending on what you have installed
});

// Initialize memory with proper configuration
const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "history",
  inputKey: "input",
  outputKey: "response",
});

// Create conversation chain with memory
const chain = new ConversationChain({
  llm,
  memory,
  verbose: true,
});

/**
 * Generates a LinkedIn post using LLM based on user task and matched repo.
 * @param {Object} options
 * @param {string} options.task - Description of the task/project completed.
 * @param {Object} options.repo - Best matched GitHub repo with name, url, description, and language.
 * @returns {Promise<string>} - The generated LinkedIn post.
 * @throws {Error} If task or repo is missing, or if LLM generation fails
 */
export async function generateLinkedInPost({ task, repo }) {
  // Input validation
  if (!task || !repo) {
    throw new Error("Task and repo are required parameters");
  }

  if (!repo.name || !repo.url) {
    throw new Error("Repo must have at least a name and URL");
  }

  const prompt = `You are a technical content writer for LinkedIn. Create an engaging post about a recently completed project.

Project Details:
- Task/Project: ${task}
- Repository: ${repo.name}
- Description: ${repo.description || "No description provided"}
- Tech Stack: ${repo.language || "Not specified"}
- GitHub URL: ${repo.url}

Requirements:
0.Dont mention about the team size.
1. Explain what was built and why it matters
2. Mention the tech stack used in the project and Mention key features
3. Include the GitHub link
4. End with a call to action (e.g., feedback, stars, connections)
5. Use 3-5 relevant hashtags
6. Keep it under 100 words
7. Make it professional but conversational
8.Use relevant emoji's


Format the post with proper spacing and line breaks for readability.`;

  try {
    // Use the chain directly with the prompt
    const response = await chain.call({
      input: prompt,
    });

    if (!response || !response.response) {
      throw new Error("No response received from LLM");
    }

    return response.response;
  } catch (error) {
    console.error("Error generating LinkedIn post:", error);
    throw new Error(`Failed to generate LinkedIn post: ${error.message}`);
  }
}

// Export memory for potential use in other parts of the application
export { memory };
