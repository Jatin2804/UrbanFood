// ─────────────────────────────────────────────
//  Home Screen Content Configuration
//  Edit this file to update banners & offers
//  without touching any component code.
// ─────────────────────────────────────────────

export interface OfferItem {
  id: string;
  image: any;
  /** Set false to hide this slide from the carousel */
  show: boolean;
}

export interface BottomBannerItem {
  id: string;
  image: any;
  onPress?: () => void;
}

// ── Offer Carousel (image only, no text) ──────
export const OFFER_ITEMS: OfferItem[] = [
  {
    id: 'offer_1',
    image: require('../../assets/images/offer_carousel_1.png'),
    show: true,
  },
  {
    id: 'offer_2',
    image: require('../../assets/images/offer_carousel_2.png'),
    show: true,
  },
  {
    id: 'offer_3',
    image: require('../../assets/images/offer_carousel_3.png'),
    show: true,
  },
];

// ── Bottom Banner ─────────────────────────────
export const BOTTOM_BANNER: BottomBannerItem = {
  id: 'bottom_banner',
  image: require('../../assets/images/offer_banner.png'),
  // onPress: () => {} — wire up later
};
