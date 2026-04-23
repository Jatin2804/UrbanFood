const ENV = {
  GITHUB_TOKEN: process.env.EXPO_PUBLIC_GITHUB_TOKEN,
  GITHUB_REPO_OWNER: 'Jatin2804',
  GITHUB_REPO_NAME: 'UrbanFoodData',
  GITHUB_BRANCH: 'main',
};

if (!ENV.GITHUB_TOKEN) {
  throw new Error("Missing GITHUB TOKEN. Check your .env file");
}

// Construct API URLs
export const API_CONFIG = {
  GITHUB_API_BASE_URL: `https://api.github.com/repos/${ENV.GITHUB_REPO_OWNER}/${ENV.GITHUB_REPO_NAME}/contents`,
  RAW_CONTENT_BASE_URL: `https://raw.githubusercontent.com/${ENV.GITHUB_REPO_OWNER}/${ENV.GITHUB_REPO_NAME}/${ENV.GITHUB_BRANCH}`,
  GITHUB_TOKEN: ENV.GITHUB_TOKEN,
};

export default ENV;
