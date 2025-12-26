import { Stock, NewsItem } from '../types';

export const MOCK_STOCKS: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 173.50,
    change: 2.35,
    changePercent: 1.37,
    volume: '54.2M',
    marketCap: '2.7T',
    peRatio: 28.5,
    sector: 'Technology',
    industry: 'Consumer Electronics',
    description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide."
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 415.20,
    change: 5.10,
    changePercent: 1.24,
    volume: '22.1M',
    marketCap: '3.1T',
    peRatio: 36.2,
    sector: 'Technology',
    industry: 'Software - Infrastructure',
    description: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide."
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 175.34,
    change: -3.45,
    changePercent: -1.93,
    volume: '98.5M',
    marketCap: '550B',
    peRatio: 42.1,
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers',
    description: "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems."
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 875.28,
    change: 15.20,
    changePercent: 1.76,
    volume: '45.3M',
    marketCap: '2.2T',
    peRatio: 72.8,
    sector: 'Technology',
    industry: 'Semiconductors',
    description: "NVIDIA Corporation focuses on personal computer (PC) graphics, graphics processing unit (GPU), and artificial intelligence (AI)."
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 178.15,
    change: 1.10,
    changePercent: 0.62,
    volume: '32.4M',
    marketCap: '1.8T',
    peRatio: 61.2,
    sector: 'Consumer Cyclical',
    industry: 'Internet Retail',
    description: "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally."
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Tech Sector Rallies as Inflation Data Beats Expectations",
    source: "Bloomberg",
    time: "2h ago",
    summary: "Major tech indices saw a significant boost this morning following the release of the latest CPI data.",
    sentiment: 'positive'
  },
  {
    id: 2,
    title: "Tesla Announces New Battery Manufacturing Breakthrough",
    source: "Reuters",
    time: "4h ago",
    summary: "Tesla engineers have reportedly achieved a 20% density increase in the new 4680 cells.",
    sentiment: 'positive'
  },
  {
    id: 3,
    title: "Federal Reserve Signals Potential Rate Cuts in Q3",
    source: "CNBC",
    time: "5h ago",
    summary: "Chairman Powell hinted that the central bank is closely monitoring cooling labor metrics.",
    sentiment: 'neutral'
  }
];

export const getHistoricalData = (symbol: string) => {
  // Simulate 30 days of data
  const data = [];
  let basePrice = MOCK_STOCKS.find(s => s.symbol === symbol)?.price || 150;
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const volatility = basePrice * 0.02;
    const change = (Math.random() * volatility * 2) - volatility;
    basePrice += change;
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: parseFloat(basePrice.toFixed(2)),
      uv: Math.floor(Math.random() * 2000) + 1000, // Volume proxy
    });
  }
  return data;
};
