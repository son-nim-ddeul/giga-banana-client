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


export interface Creation {
  creation_id: string;
  user_id: string;
  workflow?: string | null;
  metadata?: string | null;
  image_url: string;
  created_date: Date;
  status: 'active' | 'deleted';
}
