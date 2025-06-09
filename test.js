import dotenv from "dotenv";
import { fetchGitHubRepos } from "./fetch.js";

// Load environment variables
dotenv.config();

// Test the function with a GitHub username from env
async function test() {
  try {
    const username = process.env.GITHUB_USERNAME;
    if (!username) {
      throw new Error("GITHUB_USERNAME not found in .env file");
    }
    const repos = await fetchGitHubRepos(username);
    console.log("Repositories:", JSON.stringify(repos, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
