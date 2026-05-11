import { Dish } from '../features/dishes/dishesType';

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface ChatbotMessage extends ChatMessage {
  type?: 'text' | 'menu';
  dishes?: Dish[];
  dishIds?: string[]; // IDs of recommended dishes
}
