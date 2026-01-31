export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface Image {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
}
