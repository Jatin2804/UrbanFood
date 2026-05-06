// Component prop interfaces
// Add your component prop types here

export interface LanguageSelectorProps {
  // Add props if needed in the future
}

export interface MenuItem {
  icon: any;
  labelKey: string;
  iconBg: string;
  iconColor: string;
}

export interface FloatingChatbotButtonProps {
  // No props needed currently
}

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}
