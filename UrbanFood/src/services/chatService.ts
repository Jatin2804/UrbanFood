import { Booking } from '@/src/features/bookings/bookingsTypes';
import { Dish } from '@/src/features/dishes/dishesType';
import { Order } from '@/src/features/orders/ordersTypes';

const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

// Compress context and return filtered dishes
const buildCompressedContext = (message: string, menuData: Dish[]): { context: string; filteredDishes: Dish[] } => {
  const msg = message.toLowerCase();
  let filtered: Dish[] = [];

  // intent-based filtering
  if (
    msg.includes('veg') &&
    !msg.includes('non veg') &&
    !msg.includes('non-veg')
  ) {
    filtered = menuData.filter((i) => !i.nonVeg);
  } else if (msg.includes('non veg') || msg.includes('non-veg')) {
    filtered = menuData.filter((i) => i.nonVeg);
  } else if (msg.includes('top rated') || msg.includes('top reated')) {
    filtered = [...menuData].sort((a, b) => b.ratings - a.ratings).slice(0, 10);
  } else if (
    msg.includes('new') ||
    msg.includes('latest') ||
    msg.includes('newly added')
  ) {
    filtered = [...menuData]
      .sort(
        (a, b) =>
          new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime(),
      )
      .slice(0, 10);
  } else if (
    msg.includes('main course') ||
    msg.includes('lunch') ||
    msg.includes('dinner')
  ) {
    filtered = menuData.filter(
      (i) => i.type.en.toLowerCase() === 'main course',
    );
  } else if (msg.includes('fast food')) {
    filtered = menuData.filter((i) => i.type.en.toLowerCase() === 'fast food');
  } else if (
    msg.includes('starter') ||
    msg.includes('snacks') ||
    msg.includes('breakfast')
  ) {
    filtered = menuData.filter((i) => i.type.en.toLowerCase() === 'starter');
  } else if (
    msg.includes('beverage') ||
    msg.includes('drink') ||
    msg.includes('juice') ||
    msg.includes('fresh')
  ) {
    filtered = menuData.filter((i) => i.type.en.toLowerCase() === 'beverage');
  } else if (msg.includes('dessert') || msg.includes('sweet')) {
    filtered = menuData.filter((i) => i.type.en.toLowerCase() === 'dessert');
  } else {
    // fallback -> small subset
    filtered = menuData.slice(0, 8);
  }

  if (filtered.length === 0) {
    filtered = menuData.slice(0, 8);
  }

  // compression
  const context = filtered
    .map((i) => `${i.name.en}-₹${i.price}-${i.type.en}-${i.ratings}-${i.id}`)
    .join(', ');

  return { context, filteredDishes: filtered };
};

const buildSystemPrompt = (
  context: string,
  orders: Order[],
  bookings: Booking[],
) => `
You are Samosa, a smart, funny, chill assistant for a restaurant app.

Menu Context (name-price-type-rating-id):
${context}

Last 3 Orders:
${orders.map((o) => o.dishes.map((d) => d.name).join(', ')).join(' | ') || 'None'}

Last 3 Bookings:
${bookings?.map((b) => (b.tableNumber ? 'Table ' + b.tableNumber : b.bookingId)).join(', ') || 'None'}

Rules:
- Remember the conversation context and refer back to previous messages.
- Suggest items only from menu context provided.
- Keep answers short (max 5 lines).
- Be friendly, funny, and chill.
- Help user navigate app.
- When recommending dishes, suggest at max 5 dishes by name.
- Just mention the dish names naturally in your response.
`;

export interface ChatResponse {
  message: string;
  dishIds: string[];
}

// Helper to check if message is asking for recommendations
const isRecommendationQuery = (message: string): boolean => {
  const msg = message.toLowerCase();
  const recommendKeywords = [
    'recommend',
    'suggest',
    'suggestion',
    'what should',
    'what can',
    'what do',
    'what would',
    'show me',
    'give me',
    'want to try',
    'want to eat',
    'want to order',
    'looking for',
    'hungry',
    'eat',
    'order',
    'best',
    'top',
    'popular',
    'favorite',
    'favourite',
    'good',
    'great',
    'delicious',
    'tasty',
    'try',
    'have',
    'get',
    'dish',
    'food',
    'meal',
    'something',
    'anything',
    'options',
    'choice',
    'pick',
    'choose',
    'which',
    'any',
    'some',
    'veg',
    'non veg',
    'non-veg',
    'starter',
    'main course',
    'dessert',
    'beverage',
    'drink',
    'snack',
    'breakfast',
    'lunch',
    'dinner',
    'spicy',
    'sweet',
    'new',
    'latest',
    'special',
  ];
  
  const isRecommendation = recommendKeywords.some((keyword) => msg.includes(keyword));
  return isRecommendation;
};

export const sendMessageToGrok = async ({
  message,
  menuData,
  chatHistory,
  recentOrders,
  recentBookings,
}: {
  message: string;
  menuData: Dish[];
  chatHistory: { role: string; content: string }[];
  recentOrders: Order[];
  recentBookings: Booking[];
}): Promise<ChatResponse> => {
  try {
    const { context, filteredDishes } = buildCompressedContext(message, menuData);

    const messages = [
      {
        role: 'system',
        content: buildSystemPrompt(context, recentOrders, recentBookings),
      },
      ...chatHistory, // Use all provided chat history (already limited to last 6)
      {
        role: 'user',
        content: message,
      },
    ];

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    if (data.error) {
      console.error('Grok API Error Response:', data.error);
      return {
        message: `API Error: ${data.error.message || JSON.stringify(data.error)}`,
        dishIds: [],
      };
    }
    
    const rawMessage = data?.choices?.[0]?.message?.content || 'Something went wrong';
    
    // If this is a recommendation query, return the filtered dish IDs
    let dishIds: string[] = [];
    const isRecommendation = isRecommendationQuery(message);
    
    if (isRecommendation) {
      // Return up to 5 dishes from the filtered list
      dishIds = filteredDishes.slice(0, 5).map((dish) => dish.id);
    } else {
      // Fallback: Check if the response mentions any dish names
      // If it does, it's likely a recommendation even if we didn't detect it
      const mentionedDishes = filteredDishes.filter((dish) => {
        const dishName = dish.name.en.toLowerCase();
        return rawMessage.toLowerCase().includes(dishName);
      });
      
      if (mentionedDishes.length > 0) {
        dishIds = mentionedDishes.slice(0, 5).map((dish) => dish.id);
      }
    }
    
    return {
      message: rawMessage,
      dishIds,
    };
  } catch (err) {
    console.error('Grok API Exception:', err);
    return {
      message: 'Network error. Please try again.',
      dishIds: [],
    };
  }
};
