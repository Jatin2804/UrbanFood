// Multilingual text fields
interface LocalizedText {
  en: string;
  hi: string;
  te: string;
  kn: string;
}

export interface RestaurantInfo {
  id: string;
  name: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  logo: any;
  bannerImage: any;
  bannerImages: any[];
  rating: number;
  totalRatings: number;
  totalUsers: number;
  location: LocalizedText;
  address: LocalizedText;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  deliveryTime: LocalizedText;
  minOrder: number;
  phone: string;
  email: string;
  tags: LocalizedText[];
}

const restaurantInfo: RestaurantInfo = {
  id: 'urban_food_001',
  name: {
    en: 'Urban Food',
    hi: 'अर्बन फूड',
    te: 'అర్బన్ ఫుడ్',
    kn: 'ಅರ್ಬನ್ ಫುಡ್',
  },
  tagline: {
    en: 'Fresh. Fast. Delicious.',
    hi: 'ताज़ा। तेज़। स्वादिष्ट।',
    te: 'తాజా. వేగంగా. రుచికరమైన.',
    kn: 'ತಾಜಾ. ವೇಗವಾಗಿ. ರುಚಿಕರ.',
  },
  description: {
    en: 'A modern cloud kitchen serving authentic Indian, Continental, and Asian cuisine crafted with fresh ingredients and bold flavors.',
    hi: 'एक आधुनिक क्लाउड किचन जो ताज़ी सामग्री और बोल्ड फ्लेवर के साथ प्रामाणिक भारतीय, कॉन्टिनेंटल और एशियाई व्यंजन परोसता है।',
    te: 'తాజా పదార్థాలు మరియు బోల్డ్ రుచులతో ప్రామాణికమైన భారతీయ, కాంటినెంటల్ మరియు ఆసియా వంటకాలను అందించే ఆధునిక క్లౌడ్ కిచెన్.',
    kn: 'ತಾಜಾ ಪದಾರ್ಥಗಳು ಮತ್ತು ದಪ್ಪ ರುಚಿಗಳೊಂದಿಗೆ ಅಧಿಕೃತ ಭಾರತೀಯ, ಕಾಂಟಿನೆಂಟಲ್ ಮತ್ತು ಏಷ್ಯನ್ ಪಾಕಪದ್ಧತಿಯನ್ನು ಒದಗಿಸುವ ಆಧುನಿಕ ಕ್ಲೌಡ್ ಕಿಚನ್.',
  },
  logo: require('../../assets/images/logo.png'),
  bannerImage: require('../../assets/images/restraunt_1.png'),
  bannerImages: [
    require('../../assets/images/restraunt_1.png'),
    require('../../assets/images/restraunt_2.png'),
    require('../../assets/images/restraunt_3.png'),
    require('../../assets/images/restraunt_4.png'),
  ],
  rating: 4.5,
  totalRatings: 2840,
  totalUsers: 12500,
  location: {
    en: 'HSR Layout, Bangalore',
    hi: 'एचएसआर लेआउट, बैंगलोर',
    te: 'హెచ్ఎస్ఆర్ లేఅవుట్, బెంగళూరు',
    kn: 'ಎಚ್ಎಸ್ಆರ್ ಲೇಔಟ್, ಬೆಂಗಳೂರು',
  },
  address: {
    en: 'HSR Layout, Bangalore, Karnataka, India',
    hi: 'एचएसआर लेआउट, बैंगलोर, कर्नाटक, भारत',
    te: 'హెచ్ఎస్ఆర్ లేఅవుట్, బెంగళూరు, కర్ణాటక, భారతదేశం',
    kn: 'ಎಚ್ಎಸ್ಆರ್ ಲೇಔಟ್, ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ, ಭಾರತ',
  },
  openTime: '10:00 AM',
  closeTime: '11:00 PM',
  isOpen: true,
  deliveryTime: {
    en: '25–40 min',
    hi: '25–40 मिनट',
    te: '25–40 నిమిషాలు',
    kn: '25–40 ನಿಮಿಷಗಳು',
  },
  minOrder: 149,
  phone: '+91 98765 43210',
  email: 'hello@urbanfood.in',
  tags: [
    {
      en: 'Indian',
      hi: 'भारतीय',
      te: 'భారతీయ',
      kn: 'ಭಾರತೀಯ',
    },
    {
      en: 'Continental',
      hi: 'कॉन्टिनेंटल',
      te: 'కాంటినెంటల్',
      kn: 'ಕಾಂಟಿನೆಂಟಲ್',
    },
    {
      en: 'Asian',
      hi: 'एशियाई',
      te: 'ఆసియా',
      kn: 'ಏಷ್ಯನ್',
    },
    {
      en: 'Fast Food',
      hi: 'फास्ट फूड',
      te: 'ఫాస్ట్ ఫుడ్',
      kn: 'ಫಾಸ್ಟ್ ಫುಡ್',
    },
    {
      en: 'Desserts',
      hi: 'मिठाई',
      te: 'డెజర్ట్స్',
      kn: 'ಸಿಹಿತಿಂಡಿಗಳು',
    },
  ],
};

/**
 * Get restaurant info with localized text for the current language
 * @param lang - Language code (en, hi, te, kn)
 * @returns Restaurant info with text in the specified language
 */
export const getLocalizedRestaurantInfo = (lang: 'en' | 'hi' | 'te' | 'kn' = 'en') => {
  return {
    ...restaurantInfo,
    name: restaurantInfo.name[lang],
    tagline: restaurantInfo.tagline[lang],
    description: restaurantInfo.description[lang],
    location: restaurantInfo.location[lang],
    address: restaurantInfo.address[lang],
    deliveryTime: restaurantInfo.deliveryTime[lang],
    tags: restaurantInfo.tags.map(tag => tag[lang]),
  };
};

export default restaurantInfo;
