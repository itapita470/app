import React from 'react';

export interface AppInfo {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string; // Tailwind bg color class e.g. "bg-blue-500"
}

export interface Email {
  id: string;
  sender: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
}

export interface WebSource {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: WebSource;
}

export interface SearchResult {
  summary: string;
  sources: GroundingChunk[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  isLoading?: boolean;
}

export interface Conversation {
  id: string;
  contactName: string;
  messages: Message[];
}
