import axios from 'axios';
import { API_CONFIG } from '../config/env';

export const githubApi = axios.create({
  baseURL: API_CONFIG.GITHUB_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_CONFIG.GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const rawApi = axios.create({
  baseURL: API_CONFIG.RAW_CONTENT_BASE_URL,
});
