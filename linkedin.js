import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const LINKEDIN_API_URL = "https://api.linkedin.com/v2/ugcPosts";
const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;

/**
 * Post content to LinkedIn
 * @param {string} post - The content to post
 * @returns {Promise<Object>} The response from LinkedIn API
 */
export async function postToLinkedIn(post) {
  if (!LINKEDIN_ACCESS_TOKEN) {
    throw new Error("LINKEDIN_ACCESS_TOKEN not found in .env file");
  }

  try {
    // Get user profile to get the author URN using /userinfo endpoint
    const profileResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const authorUrn = `urn:li:person:${profileResponse.data.sub}`;

    // Prepare the post data
    const postData = {
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: post,
          },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    // Make the API call to create the post
    const response = await axios.post(LINKEDIN_API_URL, postData, {
      headers: {
        Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202405",
      },
    });

    console.log("✅ Successfully posted to LinkedIn!");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error posting to LinkedIn:",
      error.response?.data || error.message
    );
    throw new Error(`Failed to post to LinkedIn: ${error.message}`);
  }
}
