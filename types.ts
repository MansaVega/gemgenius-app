export enum ViewState {
  RECOVERY = 'RECOVERY',
  CHAT = 'CHAT',
  SETTINGS = 'SETTINGS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ApiConfig {
  apiKey: string | null; // In a real env this comes from process.env, but for UI logic we might track status
}