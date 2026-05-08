# Chatbot Implementation - UrbanFood

## 🤖 Overview

**Samosa** is an AI-powered chatbot using **Groq's LLaMA 3.3 70B** model. It helps users explore menus, track orders, manage bookings, and navigate the app through natural conversation.

---

## 📁 File Structure

```
app/
├── chatbot.tsx                    # Main chat interface
├── chatbot-splash.tsx             # Intro animation screen
└── chatbot-explore.tsx            # AI-recommended dishes

components/chatbot/
├── FloatingChatbotButton.tsx      # Floating access button
├── ChatbotDishCard.tsx            # Dish card component
└── ChatbotMenuCategories.tsx      # Category chips

src/services/
└── chatService.ts                 # AI integration (Groq API)

src/constants/
└── chatbot.ts                     # Constants & config

styles/
├── screens/chatbotStyles.ts       # Screen styles
└── components/chatbotMenuStyles.ts # Component styles
```

---

## ✨ Key Features

1. **AI Conversations** - Natural language chat with context awareness
2. **Dish Recommendations** - AI suggests dishes based on queries
3. **Quick Actions** - Pre-defined chips (Track Order, Show Cart, etc.)
4. **Menu Display** - Visual dish cards with categories
5. **Persistent History** - Chat saved to AsyncStorage
6. **Smart Navigation** - Auto-navigate to orders/cart/bookings
7. **Floating Button** - Always accessible with animations

---

## 🔧 How It Works

### 1. Message Flow

```
User Input → Local Intent Check → AI Processing → Response + Navigation
```

**Local Intents** (instant response, no API call):

- "track my order" → Navigate to orders
- "show cart" → Navigate to cart
- "show menu" → Display menu with dishes

**AI Processing** (for complex queries):

1. Filter menu data by intent (veg, spicy, etc.)
2. Compress context (reduce API payload)
3. Send to Groq API with chat history
4. Parse response and extract dish recommendations
5. Display response with "Explore Recommendations" button

---

### 2. AI Service (`chatService.ts`)

#### **sendMessageToGrok()**

Main API function that sends user message to Groq AI.

**Input:**

```typescript
{
  message: string,
  menuData: Dish[],
  chatHistory: { role, content }[],  // Last 6 messages
  recentOrders: Order[],              // Last 3 orders
  recentBookings: Booking[]           // Last 3 bookings
}
```

**Output:**

```typescript
{
  message: string,      // AI response
  dishIds: string[]     // Recommended dish IDs
}
```

#### **buildCompressedContext()**

Filters dishes based on user intent and compresses data.

**Intent Keywords:**

- "veg" → Vegetarian dishes
- "non veg" → Non-vegetarian dishes
- "top rated" → Highest rated dishes
- "spicy" → Spicy dishes
- "new" → Recently added dishes

**Compression Format:**

```
DishName-₹Price-Type-Rating-ID
```

#### **isRecommendationQuery()**

Detects if user is asking for recommendations.

**Keywords:** recommend, suggest, hungry, best, top, popular, spicy, etc.

---

### 3. System Prompt

```
You are Samosa, a smart, funny, chill assistant for a restaurant app.

Menu Context: [Compressed dish data]
Last 3 Orders: [Order history]
Last 3 Bookings: [Booking history]

Rules:
- Keep answers short (max 5 lines)
- Suggest only from menu context
- Be friendly and funny
- Recommend max 5 dishes by name
```

---

## 🎨 UI Components

### Chatbot Screen (`chatbot.tsx`)

**Features:**

- Message list (bot + user bubbles)
- Text input with send button
- Quick reply chips
- Typing indicator
- Menu display with categories
- Explore recommendations button

**State:**

```typescript
messages: ChatbotMessage[]
inputText: string
isTyping: boolean
showInitialChips: boolean
```

### Floating Button (`FloatingChatbotButton.tsx`)

**Animations:**

- Glow effect (pulsing opacity)
- Continuous rotation (8s per cycle)

**Position:** Bottom-right, above tab bar

---

## 🚀 Quick Start

### 1. Setup Environment

```env
# .env
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key
```

### 2. API Configuration

**Endpoint:** `https://api.groq.com/openai/v1/chat/completions`  
**Model:** `llama-3.3-70b-versatile`  
**Temperature:** 0.7

### 3. Test Queries

```
"Show menu"
"I want something spicy"
"Track my order"
"Show me veg dishes"
"Top rated dishes"
```

---

## 📊 Data Storage

**Chat History:** AsyncStorage (`@chatbot_messages`)  
**User Data:** Redux (orders, bookings, dishes)  
**Persistence:** Chat survives app restarts

---

## 🔗 Navigation

**Routes:**

- `/chatbot-splash` - Intro screen
- `/chatbot` - Main chat
- `/chatbot-explore?dishIds=1,2,3` - Recommended dishes

**Deep Links:**

```typescript
openDeepLink('/orders'); // Orders screen
openDeepLink('/(tabs)/cart'); // Cart screen
openDeepLink('/dine-in?tab=mybookings'); // Bookings
```

---

## 🎯 Quick Actions

**Quick Reply Chips:**

1. Show menu
2. Track my order
3. Track my bookings
4. Show Cart
5. User Details
6. Restaurant Details
7. Show Offers

---

## 🧪 Testing Checklist

- [ ] Send message and receive AI response
- [ ] Tap quick reply chips
- [ ] Navigate to orders/cart/bookings
- [ ] View menu with categories
- [ ] Tap dish card to view details
- [ ] Explore recommended dishes
- [ ] Clear chat history
- [ ] Chat persists after restart
- [ ] Floating button works

---

## 🔒 Security

- API key in environment variables
- Chat history stored locally only
- Max message length: 500 characters
- No personal data sent to AI

---

## 📈 Performance

**Optimizations:**

- Context compression (reduces API payload)
- Local intent fallback (instant responses)
- Chat history limit (last 6 messages only)
- AsyncStorage caching

**API Limits:**

- Free tier: 30 requests/minute
- Max tokens: 8192

---

## 🚀 Future Ideas

- Voice input
- Image recognition
- Order via chat ("Add 2 Paneer Tikka")
- Personalized recommendations
- Multi-turn conversations
- Booking via chat

---
