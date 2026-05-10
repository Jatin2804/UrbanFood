import {
  DEFAULT_REMOTE_CONFIG,
  fetchFailure,
  fetchStart,
  fetchSuccess,
  RemoteConfigData,
} from '@/src/features/remoteConfig/remoteConfigSlice';
import { AppDispatch } from '@/src/store';


const REMOTE_CONFIG_URL =
  process.env.EXPO_PUBLIC_REMOTE_CONFIG_URL || 'https://raw.githubusercontent.com/Jatin2804/UrbanFoodData/main/remoteconfig.json';

const FETCH_TIMEOUT_MS = 8000;

/**
 * Fetches remoteconfig.json from GitHub (or any raw URL) and dispatches
 * the appropriate Redux actions.  Falls back to bundled defaults on error.
 */
export const loadRemoteConfig =
  () => async (dispatch: AppDispatch) => {
    if (!REMOTE_CONFIG_URL) {
      console.warn(
        '[RemoteConfig] EXPO_PUBLIC_REMOTE_CONFIG_URL is not set. Using bundled defaults.',
      );
      dispatch(fetchSuccess(DEFAULT_REMOTE_CONFIG));
      return;
    }

    dispatch(fetchStart());

    try {
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        FETCH_TIMEOUT_MS,
      );

      const response = await fetch(REMOTE_CONFIG_URL, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const json: RemoteConfigData = await response.json();

      // Basic sanity-check — ensure required keys exist
      if (!json.bannerCarousel || !json.offerCarousel || !json.bottomBanner) {
        throw new Error('Invalid remote config shape');
      }

      dispatch(fetchSuccess(json));
      console.log('[RemoteConfig] Loaded v' + json.version + ' from remote.');
    } catch (err: any) {
      const msg: string =
        err?.name === 'AbortError'
          ? 'Request timed out'
          : (err?.message ?? 'Unknown error');

      console.warn('[RemoteConfig] Fetch failed — using defaults.', msg);
      dispatch(fetchFailure(msg));
    }
  };
