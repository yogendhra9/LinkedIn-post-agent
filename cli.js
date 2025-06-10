import readline from "readline";
import dotenv from "dotenv";
import { fetchGitHubRepos } from "./fetch.js";
import { matchDescription } from "./Matchdescription.js";
import { generateLinkedInPost } from "./llm.js";
import { confirmPost } from "./confirm.js";
import { savePost, getLatestPost } from "./postStorage.js";
import { postToLinkedIn } from "./linkedin.js";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to get user input
function getUserInput(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Display welcome message and instructions
async function showWelcome() {
  console.log("\n🚀 Welcome to LinkedIn Post Agent! 🚀\n");
  console.log(
    "This tool helps you create and post engaging content about your GitHub projects on LinkedIn."
  );
  console.log("Let's get started!\n");
}

// Check and setup environment
async function checkEnvironment() {
  console.log("🔍 Checking environment...");

  if (!process.env.GITHUB_USERNAME) {
    const username = await getUserInput("Enter your GitHub username: ");
    console.log(
      `\nPlease add this to your .env file:\nGITHUB_USERNAME=${username}\n`
    );
    process.exit(1);
  }

  if (!process.env.LINKEDIN_ACCESS_TOKEN) {
    console.log("\n⚠️ LinkedIn access token not found!");
    console.log("To get your LinkedIn access token:");
    console.log("1. Go to https://www.linkedin.com/developers/");
    console.log("2. Create a new app");
    console.log("3. Request permissions: r_liteprofile, w_member_social");
    console.log("4. Generate an access token");
    console.log(
      "\nPlease add this to your .env file:\nLINKEDIN_ACCESS_TOKEN=your_token_here\n"
    );
    process.exit(1);
  }

  console.log("✅ Environment check complete!\n");
}

// Main menu
async function showMainMenu() {
  console.log("\n📝 Main Menu:");
  console.log("1. Create new post");
  console.log("2. Use previous post");
  console.log("3. Exit");

  const choice = await getUserInput("\nSelect an option (1-3): ");
  return choice;
}

// Create new post flow
async function createNewPost() {
  console.log("\n🔄 Creating new post...");

  try {
    const repos = await fetchGitHubRepos(process.env.GITHUB_USERNAME);
    const bestMatch = matchDescription("linkedInagent", repos);

    if (!bestMatch) {
      console.log("❌ No matching repository found");
      return;
    }

    console.log("🤖 Generating post...");
    const linkedInPost = await generateLinkedInPost({
      task: "Create a LinkedIn post generator that uses GitHub repositories to create engaging technical content",
      repo: bestMatch,
    });

    console.log("\n📄 Generated Post:");
    console.log("------------------------");
    console.log(linkedInPost);

    const confirmed = await confirmPost(linkedInPost);
    if (confirmed) {
      await savePost(linkedInPost, {
        repo: bestMatch,
        task: "Create a LinkedIn post generator that uses GitHub repositories to create engaging technical content",
      });

      try {
        await postToLinkedIn(linkedInPost);
        console.log("✅ Post successfully shared on LinkedIn!");
      } catch (error) {
        console.error("❌ Failed to post to LinkedIn:", error.message);
      }
    } else {
      console.log("❌ Post cancelled");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Use previous post flow
async function usePreviousPost() {
  console.log("\n📚 Loading previous posts...");

  const previousPost = await getLatestPost();
  if (!previousPost) {
    console.log("❌ No previous posts found");
    return;
  }

  console.log("\n📄 Previous Post:");
  console.log("------------------------");
  console.log(previousPost.post);

  const confirmed = await confirmPost(previousPost.post);
  if (confirmed) {
    try {
      await postToLinkedIn(previousPost.post);
      console.log("✅ Post successfully shared on LinkedIn!");
    } catch (error) {
      console.error("❌ Failed to post to LinkedIn:", error.message);
    }
  } else {
    console.log("❌ Post cancelled");
  }
}

// Main function
async function main() {
  try {
    await showWelcome();
    await checkEnvironment();

    while (true) {
      const choice = await showMainMenu();

      switch (choice) {
        case "1":
          await createNewPost();
          break;
        case "2":
          await usePreviousPost();
          break;
        case "3":
          console.log("\n👋 Thank you for using LinkedIn Post Agent!");
          rl.close();
          process.exit(0);
        default:
          console.log("\n❌ Invalid option. Please try again.");
      }
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    rl.close();
  }
}

// Start the application
main();
