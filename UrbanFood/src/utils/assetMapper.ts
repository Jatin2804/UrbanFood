export const ASSET_MAP: Record<string, any> = {
  // Banners
  restraunt_1: require('../../assets/images/restraunt_1.png'),
  restraunt_2: require('../../assets/images/restraunt_2.png'),
  restraunt_3: require('../../assets/images/restraunt_3.png'),
  restraunt_4: require('../../assets/images/restraunt_4.png'),
  
  // Offers
  offer_carousel_1: require('../../assets/images/offer_carousel_1.png'),
  offer_carousel_2: require('../../assets/images/offer_carousel_2.png'),
  offer_carousel_3: require('../../assets/images/offer_carousel_3.png'),
  
  // Banners
  offer_banner: require('../../assets/images/offer_banner.png'),
};

export const getLocalAsset = (key: string, defaultAsset?: any) => {
  return ASSET_MAP[key] || defaultAsset;
};
