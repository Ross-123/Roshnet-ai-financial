export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  peRatio?: number;
  sector: string;
  industry: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  source: string;
  time: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface WatchlistItem {
  symbol: string;
  threshold?: number;
}

export interface AIReport {
  symbol: string;
  summary: string;
  rating: 'Buy' | 'Hold' | 'Sell';
  riskLevel: 'Low' | 'Medium' | 'High';
  keyPoints: string[];
}
