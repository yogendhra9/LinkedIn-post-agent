import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function fetchGitHubRepos(username) {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos?sort=updated&direction=desc`
    );
    return response.data.map((repo) => ({
      name: repo.name,
      description: repo.description || "",
      url: repo.html_url,
      language: repo.language || "",
    }));
  } catch (err) {
    console.error("❌ Failed to fetch repos:", err.message);
    return [];
  }
}
