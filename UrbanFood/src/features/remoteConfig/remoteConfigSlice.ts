import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BannerImage {
  id: string;
  /** Key maps to a local asset in BANNER_ASSET_MAP */
  localAsset: string;
  show: boolean;
}

export interface OfferItem {
  id: string;
  /** Key maps to a local asset in OFFER_ASSET_MAP */
  localAsset: string;
  show: boolean;
}

export interface BottomBannerConfig {
  enabled: boolean;
  id: string;
  /** Key maps to a local asset in BOTTOM_BANNER_ASSET_MAP */
  localAsset: string;
  actionType: 'none' | 'navigate' | 'url';
  actionPayload: string;
}

export interface BannerCarouselConfig {
  enabled: boolean;
  autoScrollInterval: number;
  images: BannerImage[];
}

export interface OfferCarouselConfig {
  enabled: boolean;
  autoScrollInterval: number;
  items: OfferItem[];
}

export interface RemoteConfigData {
  version: string;
  bannerCarousel: BannerCarouselConfig;
  offerCarousel: OfferCarouselConfig;
  bottomBanner: BottomBannerConfig;
}

export interface RemoteConfigState {
  data: RemoteConfigData | null;
  loading: boolean;
  error: string | null;
  /** true after first successful fetch or fallback load */
  initialized: boolean;
}



export const DEFAULT_REMOTE_CONFIG: RemoteConfigData = {
  version: '1.0.0',
  bannerCarousel: {
    enabled: true,
    autoScrollInterval: 3000,
    images: [
      { id: 'banner_1', localAsset: 'restraunt_1', show: true },
      { id: 'banner_2', localAsset: 'restraunt_2', show: true },
      { id: 'banner_3', localAsset: 'restraunt_3', show: true },
      { id: 'banner_4', localAsset: 'restraunt_4', show: true },
    ],
  },
  offerCarousel: {
    enabled: true,
    autoScrollInterval: 3500,
    items: [
      { id: 'offer_1', localAsset: 'offer_carousel_1', show: true },
      { id: 'offer_2', localAsset: 'offer_carousel_2', show: true },
      { id: 'offer_3', localAsset: 'offer_carousel_3', show: true },
    ],
  },
  bottomBanner: {
    enabled: true,
    id: 'bottom_banner',
    localAsset: 'offer_banner',
    actionType: 'none',
    actionPayload: '',
  },
};

const initialState: RemoteConfigState = {
  data: null,
  loading: false,
  error: null,
  initialized: false,
};

const remoteConfigSlice = createSlice({
  name: 'remoteConfig',
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess(state, action: PayloadAction<RemoteConfigData>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
      state.initialized = true;
    },
    fetchFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      // Fall back to defaults so the UI never breaks
      if (!state.data) {
        state.data = DEFAULT_REMOTE_CONFIG;
      }
      state.initialized = true;
    },
    /** Force-overwrite with defaults (useful for offline / first launch) */
    loadDefaults(state) {
      state.data = DEFAULT_REMOTE_CONFIG;
      state.loading = false;
      state.error = null;
      state.initialized = true;
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  loadDefaults,
} = remoteConfigSlice.actions;

export default remoteConfigSlice.reducer;
