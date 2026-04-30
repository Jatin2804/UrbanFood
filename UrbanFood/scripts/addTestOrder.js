/**
 * Script to add a test pending order to the GitHub repository
 * Run with: node scripts/addTestOrder.js
 */

const axios = require('axios');
require('dotenv').config();

const GITHUB_TOKEN = process.env.EXPO_PUBLIC_GITHUB_TOKEN;
const GITHUB_REPO_OWNER = 'Jatin2804';
const GITHUB_REPO_NAME = 'UrbanFoodData';
const GITHUB_API_BASE_URL = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents`;

// Your current user ID from the logs
const USER_ID = 'user_1776949911200';

// Create a test order with 2 minutes estimated delivery time
const now = new Date();
const estimatedTime = new Date(now.getTime() + 2 * 60000); // 2 minutes from now

const testOrder = {
  orderId: `order_${Date.now()}`,
  userId: USER_ID,
  dishes: [
    {
      dishId: 'dish_1',
      name: 'Margherita Pizza',
      price: 299,
      quantity: 2,
      nonVeg: false,
    },
    {
      dishId: 'dish_2',
      name: 'Chicken Biryani',
      price: 349,
      quantity: 1,
      nonVeg: true,
    },
  ],
  paymentType: 'cod',
  status: 'pending',
  userAddress: '123 Main Street, Apartment 4B, New York, NY 10001',
  orderTime: now.toISOString(),
  estimatedTime: estimatedTime.toISOString(),
  totalPrice: 947,
  discount: 50,
  finalPrice: 937,
  offerId: 'offer_1',
};

async function addTestOrder() {
  try {
    console.log('🔍 Checking if orders.json exists...');

    // Try to get existing orders.json
    let existingOrders = [];
    let sha = null;

    try {
      const response = await axios.get(`${GITHUB_API_BASE_URL}/orders.json`, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      sha = response.data.sha;
      const content = Buffer.from(response.data.content, 'base64').toString(
        'utf-8',
      );
      const parsed = JSON.parse(content);
      existingOrders = parsed.orders || [];
      console.log(
        `✅ Found existing orders.json with ${existingOrders.length} orders`,
      );
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('📝 orders.json does not exist, will create new file');
      } else {
        throw error;
      }
    }

    // Add the test order
    existingOrders.push(testOrder);

    // Encode the new content
    const newContent = JSON.stringify({ orders: existingOrders }, null, 2);
    const encodedContent = Buffer.from(newContent).toString('base64');

    // Update or create the file
    const updateData = {
      message: sha
        ? 'Add test pending order'
        : 'Create orders.json with test order',
      content: encodedContent,
    };

    if (sha) {
      updateData.sha = sha;
    }

    console.log('📤 Uploading to GitHub...');
    await axios.put(`${GITHUB_API_BASE_URL}/orders.json`, updateData, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    console.log('✅ Test order added successfully!');
    console.log('\n📦 Test Order Details:');
    console.log(`   Order ID: ${testOrder.orderId}`);
    console.log(`   User ID: ${testOrder.userId}`);
    console.log(`   Status: ${testOrder.status}`);
    console.log(`   Order Time: ${testOrder.orderTime}`);
    console.log(`   Estimated Time: ${testOrder.estimatedTime}`);
    console.log(`   Total Orders: ${existingOrders.length}`);
    console.log('\n🔄 Reload your app to see the floating order status!');
  } catch (error) {
    console.error('❌ Error adding test order:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

addTestOrder();
