# LinkedIn Agent

This project provides a Node.js application designed to automate interactions with the LinkedIn API, specifically focusing on posting content to a LinkedIn member's profile. It streamlines the process of obtaining and managing OAuth 2.0 access tokens, ensuring secure and authorized access to LinkedIn's features. This application is ideal for users who want to programmatically manage their LinkedIn presence or integrate LinkedIn posting capabilities into other systems.

## Features

*   **LinkedIn OAuth 2.0 Authentication:** Securely obtains and refreshes access tokens for your LinkedIn application.
*   **Automated LinkedIn Post Creation:** Publishes text content directly to a LinkedIn member's feed.
*   **Environment Variable Management:** Utilizes a `.env` file for sensitive credentials.

## Tech Stack

This application is built using the following technologies:

*   **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine, used for server-side logic.
*   **Express.js**: A fast, unopinionated, minimalist web framework for Node.js, used to create the local server for OAuth callbacks.
*   **Axios**: A promise-based HTTP client for the browser and Node.js, used for making API requests to LinkedIn.
*   **dotenv**: A zero-dependency module that loads environment variables from a `.env` file into `process.env`.
*   **Ollama**: Used for running large language models locally, enabling offline AI capabilities.
*   **LangChain**: A framework for developing applications powered by language models, used to orchestrate interactions with the LLM for tasks like post generation.

## Setup

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: [Download & Install Node.js](https://nodejs.org/) (LTS version recommended)
*   **npm** (Node Package Manager): Comes with Node.js installation.
*   **Git**: [Download & Install Git](https://git-scm.com/downloads)

### 1. LinkedIn Developer Application Setup

To use this application, you need to create and configure a LinkedIn Developer application:

*   Go to the [LinkedIn Developer Portal](https://developer.linkedin.com/).
*   Create a new application or select an existing one.
*   Navigate to the **Auth** tab for your application.
*   Under "OAuth 2.0 settings" or "Authorized redirect URLs for your app", add the following **exact** Redirect URI:
    ```
    http://localhost:3000/auth/linkedin/callback
    ```
    This is crucial for the application to receive the authorization callback.
*   Under the **Products** tab, ensure you have requested and been granted access to the following products:
    *   **Sign In with LinkedIn using OpenID Connect**: Grants `openid`, `profile`, `email` scopes.
    *   **Share on LinkedIn**: Grants the `w_member_social` scope (essential for posting).

*   Note down your **Client ID** and **Client Secret** from the **Auth** tab. You will need these for your `.env` file.

### 2. Project Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd Linked_in_agent
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### 3. Environment Variables

Create a file named `.env` in the root directory of your project (same level as `package.json`) and add the following:

```env
LINKEDIN_CLIENT_ID="YOUR_LINKEDIN_CLIENT_ID"
LINKEDIN_CLIENT_SECRET="YOUR_LINKEDIN_CLIENT_SECRET"
LINKEDIN_ACCESS_TOKEN="YOUR_LINKEDIN_ACCESS_TOKEN"
```

*   Replace `"YOUR_LINKEDIN_CLIENT_ID"` and `"YOUR_LINKEDIN_CLIENT_SECRET"` with the credentials from your LinkedIn Developer application.
*   `LINKEDIN_ACCESS_TOKEN` will be generated in the next step. Leave it empty for now or set it to a placeholder like `""`.

## Usage

### 1. Obtaining LinkedIn Access Token

The `getAccessToken.js` script is used to obtain or refresh your LinkedIn access token. You will need to run this script whenever your token expires or if you change your application's permissions in the LinkedIn Developer Portal.

1.  **Run the access token script:**
    ```bash
    node getAccessToken.js
    ```
    This will start a local server and automatically open a browser window to the LinkedIn authorization page.

2.  **Authorize the application** in the opened browser window. You will be redirected back to `http://localhost:3000/auth/linkedin/callback`.

3.  **Check your terminal:** The `getAccessToken.js` script (still running) will capture the authorization code and exchange it for a new access token. This token will be printed directly in your terminal.

4.  **Update your `.env` file:** Copy the generated `LINKEDIN_ACCESS_TOKEN` from your terminal and paste it into your `.env` file, replacing the placeholder value.

### 2. Running the Application

Once you have a valid `LINKEDIN_ACCESS_TOKEN` in your `.env` file, you can run the main application:

```bash
npm start
```

This command will execute `cli.js`, which is the entry point for your LinkedIn agent.

## Troubleshooting

*   **`Error: LINKEDIN_ACCESS_TOKEN not found in .env file`**: Ensure you have created the `.env` file and populated `LINKEDIN_ACCESS_TOKEN` after running `getAccessToken.js`.
*   **`The redirect_uri does not match the registered value`**: This is the most common issue.
    1.  Verify that `REDIRECT_URI` in `getAccessToken.js` is exactly `http://localhost:3000/auth/linkedin/callback`.
    2.  **Crucially**, ensure that `http://localhost:3000/auth/linkedin/callback` is added and **saved** as an "Authorized redirect URL" in your LinkedIn Developer application settings (Auth tab).
*   **`Not enough permissions to access: ugcPosts.CREATE.NO_VERSION` or `me.GET.NO_VERSION`**: 
    1.  Ensure your LinkedIn Developer application has the necessary products enabled (e.g., "Share on LinkedIn" for `w_member_social`, "Sign In with LinkedIn using OpenID Connect" for `openid`, `profile`, `email`).
    2.  **Re-run `node getAccessToken.js`** to get a new access token with the updated permissions, and update your `.env` file. Access tokens do not automatically gain new permissions; a new one must be generated.
*   **`Server received a callback request.` but no access token**: This indicates the server is listening, but there might still be an issue with the redirect URL. Double-check the exact match in LinkedIn Developer settings as mentioned above.

## Contributing

Feel free to open issues or pull requests if you have suggestions or improvements. 