const GITHUB_TOKEN = process.env.EXPO_PUBLIC_GITHUB_TOKEN || '';

const GITHUB_REPO_OWNER = 'Jatin2804';
const GITHUB_REPO_NAME = 'UrbanFoodData';
const GITHUB_BRANCH = 'main';

export const API_CONFIG = {
  GITHUB_API_BASE_URL: `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents`,
  RAW_CONTENT_BASE_URL: `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}`,
  GITHUB_TOKEN,
};
