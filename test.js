import dotenv from "dotenv";
import { fetchGitHubRepos } from "./fetch.js";
import { matchDescription } from "./Matchdescription.js";
import { generateLinkedInPost } from "./llm.js";
import { confirmPost } from "./confirm.js";
import { savePost, getLatestPost } from "./postStorage.js";
import { postToLinkedIn } from "./linkedin.js";
import readline from "readline";

// Load environment variables
dotenv.config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to get user input
function getUserInput(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Test the function with a GitHub username from env
async function test() {
  try {
    const username = process.env.GITHUB_USERNAME;
    if (!username) {
      throw new Error("GITHUB_USERNAME not found in .env file");
    }

    // Ask user if they want to use the previous post
    const usePrevious = await getUserInput(
      "Do you want to use the previous post? (yes/no): "
    );

    if (
      usePrevious.toLowerCase() === "yes" ||
      usePrevious.toLowerCase() === "y"
    ) {
      const previousPost = await getLatestPost();
      if (previousPost) {
        console.log("\nPrevious Post:");
        console.log("------------------------");
        console.log(previousPost.post);

        const confirmed = await confirmPost(previousPost.post);
        if (confirmed) {
          console.log("✅ Using previous post...");
          try {
            await postToLinkedIn(previousPost.post);
            console.log("✅ Post successfully shared on LinkedIn!");
          } catch (error) {
            console.error("❌ Failed to post to LinkedIn:", error.message);
          }
          return;
        }
      } else {
        console.log("No previous posts found.");
      }
    }

    const repos = await fetchGitHubRepos(username);
    const bestMatch = matchDescription("linkedInagent", repos);
    console.log("Generating🔥🔥🔥....");
    let linkedInPost = null;

    if (bestMatch) {
      linkedInPost = await generateLinkedInPost({
        task: "Create a LinkedIn post generator that uses GitHub repositories to create engaging technical content",
        repo: bestMatch,
      });

      console.log("\nGenerated LinkedIn Post:");
      console.log("------------------------");
      console.log(linkedInPost);
    } else {
      console.log("No matching repository found");
    }

    const confirmed = await confirmPost(linkedInPost);
    if (confirmed) {
      // Save the post before proceeding
      await savePost(linkedInPost, {
        repo: bestMatch,
        task: "Create a LinkedIn post generator that uses GitHub repositories to create engaging technical content",
      });
      console.log("✅ Post saved, proceeding to post to LinkedIn...");

      try {
        await postToLinkedIn(linkedInPost);
        console.log("✅ Post successfully shared on LinkedIn!");
      } catch (error) {
        console.error("❌ Failed to post to LinkedIn:", error.message);
      }
    } else {
      console.log("❌ Post cancelled.");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    rl.close();
  }
}

test();
