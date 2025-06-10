import readline from "readline";

/**
 * Prompt the user to confirm the generated post.
 * @param {string} post - The generated LinkedIn post to review.
 * @returns {Promise<boolean>} - True if user confirms, false otherwise.
 */
export function confirmPost(post) {
  return new Promise((resolve) => {
    console.log("\n🔹 Generated LinkedIn Post:\n");
    console.log(post);
    console.log("\nDo you want to post this on LinkedIn? (yes/no)");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("> ", (answer) => {
      rl.close();
      const cleaned = answer.trim().toLowerCase();
      resolve(cleaned === "yes" || cleaned === "y");
    });
  });
}
