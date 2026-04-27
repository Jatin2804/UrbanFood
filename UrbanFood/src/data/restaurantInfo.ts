export interface RestaurantInfo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: any;
  bannerImage: any;
  bannerImages: any[];
  rating: number;
  totalRatings: number;
  totalUsers: number;
  location: string;
  address: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  deliveryTime: string;
  minOrder: number;
  phone: string;
  email: string;
  tags: string[];
}

const restaurantInfo: RestaurantInfo = {
  id: 'urban_food_001',
  name: 'Urban Food',
  tagline: 'Fresh. Fast. Delicious.',
  description:
    'A modern cloud kitchen serving authentic Indian, Continental, and Asian cuisine crafted with fresh ingredients and bold flavors.',
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
  location: 'HSR Layout, Bangalore',
  address: 'HSR Layout, Bangalore, Karnataka, India',
  openTime: '10:00 AM',
  closeTime: '11:00 PM',
  isOpen: true,
  deliveryTime: '25–40 min',
  minOrder: 149,
  phone: '+91 98765 43210',
  email: 'hello@urbanfood.in',
  tags: ['Indian', 'Continental', 'Asian', 'Fast Food', 'Desserts'],
};

export default restaurantInfo;
