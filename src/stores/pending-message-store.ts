import { create } from 'zustand';

interface PendingImage {
  uri: string;
  mimeType: string;
}

interface PendingMessage {
  content: string;
  image?: PendingImage;
}

interface PendingMessageStore {
  pendingMessage: PendingMessage | null;
  setPendingMessage: (message: PendingMessage | null) => void;
  clearPendingMessage: () => void;
}

export const usePendingMessageStore = create<PendingMessageStore>((set) => ({
  pendingMessage: null,
  setPendingMessage: (message) => set({ pendingMessage: message }),
  clearPendingMessage: () => set({ pendingMessage: null }),
}));
