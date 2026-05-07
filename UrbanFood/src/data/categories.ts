export interface FoodCategory {
  id: string;
  name: string;
  nameHi: string;
  nameTe: string;
  nameKn: string;
  image: string;
  deepLink: string;
}

export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: 'main-course',
    name: 'Main Course',
    nameHi: 'मुख्य व्यंजन',
    nameTe: 'ప్రధాన వంటకం',
    nameKn: 'ಮುಖ್ಯ ಭೋಜನ',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    deepLink: '/explore?category=maincourse',
  },
  {
    id: 'starter',
    name: 'Starter',
    nameHi: 'स्टार्टर',
    nameTe: 'స్టార్టర్',
    nameKn: 'ಸ್ಟಾರ್ಟರ್',
    image:
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop',
    deepLink: '/explore?category=starters',
  },
  {
    id: 'fast-food',
    name: 'Fast Food',
    nameHi: 'फास्ट फूड',
    nameTe: 'ఫాస్ట్ ఫుడ్',
    nameKn: 'ಫಾಸ್ಟ್ ಫುಡ್',
    image:
      'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=400&fit=crop',
    deepLink: '/explore?category=fastfood',
  },
  {
    id: 'beverage',
    name: 'Beverage',
    nameHi: 'पेय',
    nameTe: 'పానీయం',
    nameKn: 'ಪಾನೀಯ',
    image:
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop',
    deepLink: '/explore?category=beverage',
  },
  {
    id: 'dessert',
    name: 'Dessert',
    nameHi: 'मिठाई',
    nameTe: 'డెజర్ట్',
    nameKn: 'ಸಿಹಿತಿಂಡಿ',
    image:
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop',
    deepLink: '/explore?category=dessert',
  },
];
