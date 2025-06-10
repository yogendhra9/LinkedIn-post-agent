import fs from "fs/promises";
import path from "path";

const STORAGE_FILE = "posts.json";

/**
 * Save a generated post to storage
 * @param {string} post - The LinkedIn post to save
 * @param {Object} metadata - Additional metadata about the post
 * @returns {Promise<void>}
 */
export async function savePost(post, metadata = {}) {
  try {
    let posts = [];
    try {
      const data = await fs.readFile(STORAGE_FILE, "utf8");
      posts = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, start with empty array
    }

    posts.push({
      id: Date.now(),
      post,
      metadata,
      timestamp: new Date().toISOString(),
    });

    await fs.writeFile(STORAGE_FILE, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error("Error saving post:", error);
    throw error;
  }
}

/**
 * Get all saved posts
 * @returns {Promise<Array>} Array of saved posts
 */
export async function getPosts() {
  try {
    const data = await fs.readFile(STORAGE_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

/**
 * Get a specific post by ID
 * @param {number} id - The ID of the post to retrieve
 * @returns {Promise<Object|null>} The post or null if not found
 */
export async function getPostById(id) {
  const posts = await getPosts();
  return posts.find((post) => post.id === id) || null;
}

/**
 * Get the most recent post
 * @returns {Promise<Object|null>} The most recent post or null if no posts exist
 */
export async function getLatestPost() {
  const posts = await getPosts();
  return posts.length > 0 ? posts[posts.length - 1] : null;
}
