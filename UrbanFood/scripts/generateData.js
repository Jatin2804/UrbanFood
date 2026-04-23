const fs = require('fs');
const path = require('path');

// ─── USERS ───
const indianNames = [
  'Aarav Sharma', 'Priya Patel', 'Rohan Mehta', 'Ananya Gupta', 'Vikram Singh',
  'Sneha Reddy', 'Arjun Nair', 'Kavya Iyer', 'Rahul Verma', 'Diya Joshi',
  'Aditya Kapoor', 'Meera Bhat', 'Karan Malhotra', 'Ishita Desai', 'Nikhil Rao',
  'Pooja Kulkarni', 'Siddharth Menon', 'Riya Chopra', 'Amit Tiwari', 'Nandini Pillai'
];

const users = indianNames.map((name, i) => {
  const id = `user_${String(i + 1).padStart(3, '0')}`;
  const email = name.toLowerCase().replace(/\s/g, '.') + '@gmail.com';
  const phone = '+91 ' + (7000000000 + Math.floor(Math.random() * 3000000000)).toString().replace(/(\d{5})(\d{5})/, '$1 $2');
  const pin = String(1000 + Math.floor(Math.random() * 9000));
  return { id, name, email, phone, pin };
});

// ─── DISHES ───
const dishData = [
  // Indian Main Course (25)
  { name: 'Butter Chicken', type: 'main course', nonVeg: true, price: 320, img: 'photo-1603894584373-5ac82b2ae398' },
  { name: 'Paneer Tikka Masala', type: 'main course', nonVeg: false, price: 280, img: 'photo-1565557623262-b51c2513a641' },
  { name: 'Dal Makhani', type: 'main course', nonVeg: false, price: 220, img: 'photo-1546833999-b9f581a1996d' },
  { name: 'Chicken Biryani', type: 'main course', nonVeg: true, price: 350, img: 'photo-1563379091339-03b21ab4a4f8' },
  { name: 'Palak Paneer', type: 'main course', nonVeg: false, price: 240, img: 'photo-1601050690597-df0568f70950' },
  { name: 'Mutton Rogan Josh', type: 'main course', nonVeg: true, price: 420, img: 'photo-1545247181-516773cae754' },
  { name: 'Chole Bhature', type: 'main course', nonVeg: false, price: 180, img: 'photo-1626132647523-66068394d31c' },
  { name: 'Egg Curry', type: 'main course', nonVeg: true, price: 200, img: 'photo-1604908176997-125f25cc6f3d' },
  { name: 'Rajma Chawal', type: 'main course', nonVeg: false, price: 190, img: 'photo-1585937421612-70a008356fbe' },
  { name: 'Kadai Chicken', type: 'main course', nonVeg: true, price: 310, img: 'photo-1610057099431-d73a1c9d2f2f' },
  { name: 'Malai Kofta', type: 'main course', nonVeg: false, price: 260, img: 'photo-1574484284002-952d92456975' },
  { name: 'Fish Curry', type: 'main course', nonVeg: true, price: 340, img: 'photo-1626777552726-4a6b54c97e46' },
  { name: 'Paneer Butter Masala', type: 'main course', nonVeg: false, price: 270, img: 'photo-1588166524941-3bf61a9c41db' },
  { name: 'Hyderabadi Dum Biryani', type: 'main course', nonVeg: true, price: 380, img: 'photo-1589302168068-964664d93dc0' },
  { name: 'Aloo Gobi', type: 'main course', nonVeg: false, price: 180, img: 'photo-1585937421612-70a008356fbe' },
  { name: 'Chicken Tikka Masala', type: 'main course', nonVeg: true, price: 330, img: 'photo-1565557623262-b51c2513a641' },
  { name: 'Baingan Bharta', type: 'main course', nonVeg: false, price: 200, img: 'photo-1574484284002-952d92456975' },
  { name: 'Prawn Masala', type: 'main course', nonVeg: true, price: 450, img: 'photo-1626777552726-4a6b54c97e46' },
  // International Main Course (7)
  { name: 'Margherita Pizza', type: 'main course', nonVeg: false, price: 350, img: 'photo-1574071318508-1cdbab80d002' },
  { name: 'Grilled Chicken Pasta', type: 'main course', nonVeg: true, price: 320, img: 'photo-1621996346565-e3dbc646d9a9' },
  { name: 'Spaghetti Bolognese', type: 'main course', nonVeg: true, price: 340, img: 'photo-1622973536968-3ead9e780960' },
  { name: 'Mushroom Risotto', type: 'main course', nonVeg: false, price: 380, img: 'photo-1476124369491-e7addf5db371' },
  { name: 'Thai Green Curry', type: 'main course', nonVeg: true, price: 360, img: 'photo-1455619452474-d2be8b1e70cd' },
  { name: 'Pad Thai Noodles', type: 'main course', nonVeg: true, price: 300, img: 'photo-1559314809-0d155014e29e' },
  { name: 'Penne Arrabiata', type: 'main course', nonVeg: false, price: 290, img: 'photo-1563379926898-05f4575a45d8' },

  // Starters (20)
  { name: 'Paneer Tikka', type: 'starter', nonVeg: false, price: 220, img: 'photo-1567188040759-fb8a883dc6d8' },
  { name: 'Chicken Seekh Kebab', type: 'starter', nonVeg: true, price: 260, img: 'photo-1599487488170-d11ec9c172f0' },
  { name: 'Samosa', type: 'starter', nonVeg: false, price: 120, img: 'photo-1601050690597-df0568f70950' },
  { name: 'Onion Bhaji', type: 'starter', nonVeg: false, price: 140, img: 'photo-1625220194771-7ebdea0b70b9' },
  { name: 'Tandoori Chicken', type: 'starter', nonVeg: true, price: 300, img: 'photo-1610057099431-d73a1c9d2f2f' },
  { name: 'Hara Bhara Kebab', type: 'starter', nonVeg: false, price: 180, img: 'photo-1567188040759-fb8a883dc6d8' },
  { name: 'Chicken Lollipop', type: 'starter', nonVeg: true, price: 280, img: 'photo-1562967914-608f82629710' },
  { name: 'Aloo Tikki', type: 'starter', nonVeg: false, price: 130, img: 'photo-1606491956689-2ea866880049' },
  { name: 'Fish Finger', type: 'starter', nonVeg: true, price: 290, img: 'photo-1626645738196-c2a7c87a8f58' },
  { name: 'Spring Rolls', type: 'starter', nonVeg: false, price: 180, img: 'photo-1548507200-2e58118a8494' },
  { name: 'Bruschetta', type: 'starter', nonVeg: false, price: 200, img: 'photo-1572695157366-5e585ab2b69f' },
  { name: 'Chicken Wings', type: 'starter', nonVeg: true, price: 320, img: 'photo-1608039829572-9b9d0d396595' },
  { name: 'Stuffed Mushrooms', type: 'starter', nonVeg: false, price: 250, img: 'photo-1504674900247-0877df9cc836' },
  { name: 'Prawn Tempura', type: 'starter', nonVeg: true, price: 350, img: 'photo-1615141982883-c7ad0e69fd62' },
  { name: 'Dahi Kebab', type: 'starter', nonVeg: false, price: 190, img: 'photo-1567188040759-fb8a883dc6d8' },
  { name: 'Mutton Shammi Kebab', type: 'starter', nonVeg: true, price: 310, img: 'photo-1599487488170-d11ec9c172f0' },
  { name: 'Corn Cheese Balls', type: 'starter', nonVeg: false, price: 200, img: 'photo-1548507200-2e58118a8494' },
  { name: 'Garlic Bread', type: 'starter', nonVeg: false, price: 150, img: 'photo-1619535860434-ba1d8fa12536' },
  { name: 'Pani Puri', type: 'starter', nonVeg: false, price: 100, img: 'photo-1625220194771-7ebdea0b70b9' },
  { name: 'Chilli Chicken', type: 'starter', nonVeg: true, price: 270, img: 'photo-1562967914-608f82629710' },

  // Fast Food (15)
  { name: 'Classic Chicken Burger', type: 'fast food', nonVeg: true, price: 180, img: 'photo-1568901346375-23c9450c58cd' },
  { name: 'Veggie Wrap', type: 'fast food', nonVeg: false, price: 150, img: 'photo-1626700051175-6818013e1d4f' },
  { name: 'French Fries', type: 'fast food', nonVeg: false, price: 120, img: 'photo-1573080496219-bb080dd4f877' },
  { name: 'Chicken Shawarma', type: 'fast food', nonVeg: true, price: 170, img: 'photo-1529006557810-274b9b2fc783' },
  { name: 'Paneer Frankie', type: 'fast food', nonVeg: false, price: 140, img: 'photo-1626700051175-6818013e1d4f' },
  { name: 'Veg Cheese Pizza', type: 'fast food', nonVeg: false, price: 250, img: 'photo-1574071318508-1cdbab80d002' },
  { name: 'Chicken Momos', type: 'fast food', nonVeg: true, price: 160, img: 'photo-1534422298391-e4f8c172dddb' },
  { name: 'Veg Momos', type: 'fast food', nonVeg: false, price: 130, img: 'photo-1534422298391-e4f8c172dddb' },
  { name: 'Hot Dog', type: 'fast food', nonVeg: true, price: 150, img: 'photo-1612392062126-5cc76074c52f' },
  { name: 'Vada Pav', type: 'fast food', nonVeg: false, price: 100, img: 'photo-1606491956689-2ea866880049' },
  { name: 'Dosa Masala', type: 'fast food', nonVeg: false, price: 160, img: 'photo-1630383249896-424e482df921' },
  { name: 'Pav Bhaji', type: 'fast food', nonVeg: false, price: 170, img: 'photo-1606491956689-2ea866880049' },
  { name: 'Egg Roll', type: 'fast food', nonVeg: true, price: 130, img: 'photo-1626700051175-6818013e1d4f' },
  { name: 'Cheese Burst Pizza', type: 'fast food', nonVeg: false, price: 400, img: 'photo-1574071318508-1cdbab80d002' },
  { name: 'Crispy Chicken Taco', type: 'fast food', nonVeg: true, price: 200, img: 'photo-1551504734-5ee1c4a1479b' },

  // Beverages (15)
  { name: 'Cold Coffee', type: 'beverage', nonVeg: false, price: 150, img: 'photo-1461023058943-07fcbe16d735' },
  { name: 'Masala Chai', type: 'beverage', nonVeg: false, price: 100, img: 'photo-1571934811356-5cc061b6821f' },
  { name: 'Mango Lassi', type: 'beverage', nonVeg: false, price: 130, img: 'photo-1527661591475-527312dd65f5' },
  { name: 'Fresh Lime Soda', type: 'beverage', nonVeg: false, price: 110, img: 'photo-1513558161293-cdaf765ed93d' },
  { name: 'Strawberry Milkshake', type: 'beverage', nonVeg: false, price: 180, img: 'photo-1572490122747-3968b75cc699' },
  { name: 'Green Tea', type: 'beverage', nonVeg: false, price: 120, img: 'photo-1556881286-fc6915169721' },
  { name: 'Oreo Shake', type: 'beverage', nonVeg: false, price: 200, img: 'photo-1572490122747-3968b75cc699' },
  { name: 'Watermelon Juice', type: 'beverage', nonVeg: false, price: 130, img: 'photo-1534353473418-4cfa6c56fd38' },
  { name: 'Cappuccino', type: 'beverage', nonVeg: false, price: 180, img: 'photo-1572442388796-11668a67e53d' },
  { name: 'Mojito', type: 'beverage', nonVeg: false, price: 170, img: 'photo-1513558161293-cdaf765ed93d' },
  { name: 'Iced Americano', type: 'beverage', nonVeg: false, price: 200, img: 'photo-1461023058943-07fcbe16d735' },
  { name: 'Thandai', type: 'beverage', nonVeg: false, price: 140, img: 'photo-1527661591475-527312dd65f5' },
  { name: 'Butter Milk', type: 'beverage', nonVeg: false, price: 100, img: 'photo-1527661591475-527312dd65f5' },
  { name: 'Espresso', type: 'beverage', nonVeg: false, price: 150, img: 'photo-1510707577719-ae7c14805e3a' },
  { name: 'Hot Chocolate', type: 'beverage', nonVeg: false, price: 190, img: 'photo-1542990253-0d0f5be5f0ed' },

  // Desserts (15)
  { name: 'Gulab Jamun', type: 'dessert', nonVeg: false, price: 150, img: 'photo-1666190020070-9c500e8e10a4' },
  { name: 'Rasgulla', type: 'dessert', nonVeg: false, price: 140, img: 'photo-1645177628172-a94c1f96e6db' },
  { name: 'Chocolate Brownie', type: 'dessert', nonVeg: true, price: 200, img: 'photo-1606313564200-e75d5e30476c' },
  { name: 'Rasmalai', type: 'dessert', nonVeg: false, price: 180, img: 'photo-1645177628172-a94c1f96e6db' },
  { name: 'Tiramisu', type: 'dessert', nonVeg: true, price: 350, img: 'photo-1571877227200-a0d98ea607e9' },
  { name: 'Kulfi Falooda', type: 'dessert', nonVeg: false, price: 170, img: 'photo-1527661591475-527312dd65f5' },
  { name: 'Jalebi', type: 'dessert', nonVeg: false, price: 120, img: 'photo-1601050690597-df0568f70950' },
  { name: 'Chocolate Lava Cake', type: 'dessert', nonVeg: true, price: 300, img: 'photo-1606313564200-e75d5e30476c' },
  { name: 'Mango Cheesecake', type: 'dessert', nonVeg: true, price: 280, img: 'photo-1567171466295-4afa63d45416' },
  { name: 'Gajar Ka Halwa', type: 'dessert', nonVeg: false, price: 160, img: 'photo-1574484284002-952d92456975' },
  { name: 'Kheer', type: 'dessert', nonVeg: false, price: 140, img: 'photo-1574484284002-952d92456975' },
  { name: 'Ice Cream Sundae', type: 'dessert', nonVeg: false, price: 220, img: 'photo-1563805042-7684c019e1cb' },
  { name: 'Panna Cotta', type: 'dessert', nonVeg: true, price: 320, img: 'photo-1488477181946-6428a0291777' },
  { name: 'Moong Dal Halwa', type: 'dessert', nonVeg: false, price: 180, img: 'photo-1574484284002-952d92456975' },
  { name: 'Fruit Trifle', type: 'dessert', nonVeg: false, price: 250, img: 'photo-1488477181946-6428a0291777' },

  // Additional dishes to reach 100 (10)
  { name: 'Keema Pav', type: 'main course', nonVeg: true, price: 230, img: 'photo-1585937421612-70a008356fbe' },
  { name: 'Shahi Paneer', type: 'main course', nonVeg: false, price: 260, img: 'photo-1588166524941-3bf61a9c41db' },
  { name: 'Lamb Shanks', type: 'main course', nonVeg: true, price: 490, img: 'photo-1545247181-516773cae754' },
  { name: 'Veggie Supreme Pizza', type: 'fast food', nonVeg: false, price: 380, img: 'photo-1574071318508-1cdbab80d002' },
  { name: 'Chicken Fried Rice', type: 'fast food', nonVeg: true, price: 220, img: 'photo-1603133872878-684f208fb84b' },
  { name: 'Hakka Noodles', type: 'fast food', nonVeg: false, price: 190, img: 'photo-1559314809-0d155014e29e' },
  { name: 'Phirni', type: 'dessert', nonVeg: false, price: 130, img: 'photo-1574484284002-952d92456975' },
  { name: 'Banana Split', type: 'dessert', nonVeg: false, price: 240, img: 'photo-1563805042-7684c019e1cb' },
  { name: 'Rose Milk', type: 'beverage', nonVeg: false, price: 120, img: 'photo-1572490122747-3968b75cc699' },
  { name: 'Filter Coffee', type: 'beverage', nonVeg: false, price: 110, img: 'photo-1510707577719-ae7c14805e3a' },
];

// Different image style variants for carousel
const imageVariants = [
  // Variant 1: Standard landscape
  { suffix: 'landscape', width: 1200, height: 800, fit: 'crop' },
  // Variant 2: Portrait style
  { suffix: 'portrait', width: 800, height: 1200, fit: 'crop' },
  // Variant 3: Square/thumbnail style
  { suffix: 'square', width: 800, height: 800, fit: 'crop' }
];

// Different image filters/effects for variety
const imageEffects = [
  '',
  '&sat=-20',
  '&bright=5',
  '&con=10',
  '&blur=50',
  '&sharp=15'
];

function generateCarouselImages(baseImgId, index) {
  // Use different Unsplash photo IDs for variety (adding random offsets)
  const photoIds = [
    baseImgId,
    baseImgId.replace(/(\d+)$/, (m) => parseInt(m) + 100),
    baseImgId.replace(/(\d+)$/, (m) => parseInt(m) + 200)
  ];
  
  return imageVariants.map((variant, i) => {
    const photoId = photoIds[i % photoIds.length];
    const effect = imageEffects[(index + i) % imageEffects.length];
    return `https://images.unsplash.com/${photoId}?w=${variant.width}&h=${variant.height}&fit=${variant.fit}&auto=format&q=80${effect}`;
  });
}

// Feedback comments pool
const feedbackComments = [
  'Absolutely loved it! Will order again.',
  'Tasted amazing, perfectly spiced.',
  'Good portion size, great value for money.',
  'Could be a bit spicier, but overall good.',
  'Best I\'ve had in a while, highly recommend!',
  'Fresh ingredients, you can really tell the difference.',
  'A bit too oily for my taste, but flavors were on point.',
  'Perfect comfort food for a rainy day.',
  'Presentation was beautiful and taste was even better.',
  'Slightly overcooked, but still enjoyable.',
  'My go-to dish from this place. Never disappoints.',
  'Would have loved more sauce, but the base was delicious.',
  'Reminded me of homemade food. So nostalgic!',
  'Great texture and seasoning. Really impressed.',
  'Decent, nothing extraordinary but satisfying.',
  'The best version I\'ve tried outside of a restaurant.',
  'Perfectly balanced flavors, loved every bite.',
  'A little underwhelming compared to expectations.',
  'Crispy on the outside, juicy inside. Perfect!',
  'Would be better with less salt, but I still enjoyed it.',
  'Melt-in-your-mouth goodness. Absolutely divine.',
  'Nice and light, perfect for a quick meal.',
  'Authentic taste, just like street food in Delhi.',
  'Rich and creamy, every spoonful was a delight.',
  'Could use a bit more seasoning but overall solid.',
  'The aroma alone was worth the order. Tasted heavenly.',
  'Very filling and satisfying. Great lunch option.',
  'Surprisingly good! Did not expect this quality.',
  'A bit pricey but totally worth the experience.',
  'I\'ve ordered this five times now. Consistently great.',
  'Just the right amount of sweetness.',
  'Smooth and refreshing, loved every sip.',
  'Perfect way to end a meal.',
  'Could eat this every single day and never get bored.',
  'The spice level was perfect, not too mild not too hot.',
  'Really fresh and well-prepared.',
  'My kids absolutely loved this dish!',
  'Great for sharing with friends and family.',
  'Not bad, but I\'ve had better elsewhere.',
  'Excellent quality, restaurant-level at home.',
];

function randomDate(start, end) {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split('T')[0];
}

function randomRating() {
  return +(3 + Math.random() * 2).toFixed(1);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

// Build dishes with carousel images
const dishes = dishData.map((d, i) => {
  const id = `dish_${String(i + 1).padStart(3, '0')}`;
  const rating = randomRating();
  const feedbackCount = 2 + Math.floor(Math.random() * 4); // 2-5 feedback items
  const feedback = pickN(users, feedbackCount).map(u => ({
    userId: u.id,
    comment: pick(feedbackComments),
    rating: randomRating()
  }));

  // Generate 3 different images for carousel
  const bannerImages = generateCarouselImages(d.img, i);

  return {
    id,
    name: d.name,
    type: d.type,
    bannerImages, // Now contains 3 different images with different dimensions
    ratings: rating,
    feedback,
    addedDate: randomDate(new Date('2024-06-01'), new Date('2025-12-31')),
    price: d.price,
    nonVeg: d.nonVeg
  };
});

// Build orders
const orderTypes = ['cashOnDelivery', 'takeaway', 'dinein'];
const orderFeedbackComments = [
  'Quick delivery, everything was hot and fresh.',
  'One item was missing, but the rest was good.',
  'Packaging was excellent, no spills at all.',
  'Took longer than expected but food quality was great.',
  'Everything was perfect. 10/10 experience!',
  'Great value combo. Will definitely reorder.',
  'Food arrived cold. Disappointed.',
  'Loved the variety, all dishes were flavorful.',
  'Smooth ordering experience and tasty food.',
  'Portions were generous, very happy with this order.',
  'The dine-in experience was lovely and relaxing.',
  'Takeaway was packed neatly, food was still warm.',
  'Staff was very friendly and helpful during dine-in.',
  'Would prefer better packaging for delivery.',
  'Fast service and the food was absolutely delicious.',
];

const orders = [];
for (let i = 0; i < 30; i++) {
  const orderId = `order_${String(i + 1).padStart(3, '0')}`;
  const user = pick(users);
  const dishCount = 2 + Math.floor(Math.random() * 4); // 2-5 dishes
  const orderDishes = pickN(dishes, dishCount).map(d => ({
    dishId: d.id,
    name: d.name,
    price: d.price
  }));
  const totalOrderPrice = orderDishes.reduce((sum, d) => sum + d.price, 0);
  const feedbackCount = 1 + Math.floor(Math.random() * 3);
  const userFeedback = Array.from({ length: feedbackCount }, () => ({
    comment: pick(orderFeedbackComments),
    rating: randomRating()
  }));

  orders.push({
    orderId,
    userId: user.id,
    dishes: orderDishes,
    totalOrderPrice,
    date: randomDate(new Date('2026-01-01'), new Date('2026-04-23')),
    success: Math.random() > 0.15,
    type: pick(orderTypes),
    userFeedback
  });
}

// Final output
const dataset = { users, dishes, orders };

const outDir = path.join(__dirname, '..', 'assets', 'data');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'dataset.json');
fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2), 'utf-8');

console.log(`✅ Dataset generated successfully!`);
console.log(`   📍 Location: ${outPath}`);
console.log(`   👤 Users: ${users.length}`);
console.log(`   🍽️  Dishes: ${dishes.length}`);
console.log(`   📦 Orders: ${orders.length}`);
console.log(`   🖼️  Each dish now has 3 different carousel images with varying dimensions!`);