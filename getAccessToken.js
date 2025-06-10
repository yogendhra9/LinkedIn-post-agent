import dotenv from "dotenv";
import open from "open";
import express from "express";
import { URLSearchParams } from "url";
import axios from "axios";

dotenv.config();

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/auth/linkedin/callback";
//  // IMPORTANT: This must match your LinkedIn app's Redirect URI
const SCOPE = "openid profile w_member_social email"; // Permissions required

const app = express();
const PORT = 3000;

async function getAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error(
      "Please ensure LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET are set in your .env file."
    );
    process.exit(1);
  }

  // Step 1: Redirect user to LinkedIn for authorization
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${encodeURIComponent(SCOPE)}`;

  console.log("\nOpening LinkedIn authorization page in your browser...");
  console.log("Please authorize the application.\n");
  await open(authUrl);

  // Step 2: Set up a local server to listen for the redirect callback
  app.get("/auth/linkedin/callback", async (req, res) => {
    console.log("Server received a callback request.");
    const authCode = req.query.code;

    if (!authCode) {
      console.error(
        "❌ Authorization code not received.",
        req.query.error_description || "No error description."
      );
      res.send("Authorization failed. Please check your console for details.");
      server.close();
      return;
    }

    console.log(
      "✅ Authorization code received. Exchanging for Access Token..."
    );

    // Step 3: Exchange authorization code for access token
    const tokenUrl = "https://www.linkedin.com/oauth/v2/accessToken";
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", authCode);
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("redirect_uri", REDIRECT_URI);

    try {
      const response = await axios.post(tokenUrl, params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const accessToken = response.data.access_token;
      const expiresIn = response.data.expires_in;

      console.log("\n🎉 Your LinkedIn Access Token is:\n");
      console.log(accessToken);
      console.log(
        `\nThis token expires in ${expiresIn} seconds. You'll need to re-run this script to get a new one after it expires.\n`
      );
      console.log(
        "Please add this to your .env file as LINKEDIN_ACCESS_TOKEN.\n"
      );

      res.send(
        "Authentication successful! You can now close this tab. Check your console for the access token."
      );
    } catch (error) {
      console.error(
        "❌ Error exchanging code for token:",
        error.response?.data || error.message
      );
      res.send("Error obtaining access token. Check your console for details.");
    } finally {
      server.close(); // Close the server after processing the request
    }
  });

  const server = app.listen(PORT, () => {
    console.log(`Local server listening on http://localhost:${PORT}`);
    console.log("Waiting for LinkedIn redirect...");
  });
}

getAccessToken();
// import axios from "axios";
// import readline from "readline";
// import dotenv from "dotenv";

// dotenv.config();

// const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
// const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

// async function startDeviceFlow() {
//   const res = await axios.post(
//     "https://www.linkedin.com/oauth/v2/device/code",
//     new URLSearchParams({
//       client_id: CLIENT_ID,
//       scope: "w_member_social",
//     }),
//     {
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     }
//   );

//   const { user_code, device_code, verification_uri, expires_in, interval } = res.data;

//   console.log(`\n🔐 Go to ${verification_uri} and enter this code: ${user_code}`);
//   console.log("⏳ Waiting for you to authorize the app...\n");

//   // Polling
//   let accessToken;
//   const poll = async () => {
//     try {
//       const tokenRes = await axios.post(
//         "https://www.linkedin.com/oauth/v2/device/token",
//         new URLSearchParams({
//           grant_type: "urn:ietf:params:oauth:grant-type:device_code",
//           device_code,
//           client_id: CLIENT_ID,
//           client_secret: CLIENT_SECRET,
//         }),
//         {
//           headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         }
//       );

//       accessToken = tokenRes.data.access_token;
//       console.log(`🎉 Access Token: ${accessToken}`);
//     } catch (err) {
//       if (err.response && err.response.data.error === "authorization_pending") {
//         // keep polling
//         setTimeout(poll, interval * 1000);
//       } else {
//         console.error("❌ Failed:", err.response?.data || err.message);
//       }
//     }
//   };

//   poll();
// }

// startDeviceFlow();
