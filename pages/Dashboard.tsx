import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, RefreshCw, Zap, ArrowRight, Activity } from 'lucide-react';
import { MOCK_STOCKS, getHistoricalData, MOCK_NEWS } from '../services/mockData';
import { generateMarketSummary } from '../services/gemini';
import { Stock } from '../types';
import { Button } from '../components/ui/Button';

interface DashboardProps {
  onSelectStock: (stock: Stock) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectStock }) => {
  const [aiSummary, setAiSummary] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedChartStock, setSelectedChartStock] = useState(MOCK_STOCKS[0]);
  const [chartData, setChartData] = useState(getHistoricalData(MOCK_STOCKS[0].symbol));

  useEffect(() => {
    // Initial AI Summary
    handleGenerateSummary();
  }, []);

  const handleGenerateSummary = async () => {
    if (!process.env.API_KEY) {
      setAiSummary("Please configure your Gemini API Key in the environment to see AI insights.");
      return;
    }
    setIsGenerating(true);
    const summary = await generateMarketSummary(MOCK_STOCKS);
    setAiSummary(summary);
    setIsGenerating(false);
  };

  const handleStockClick = (stock: Stock) => {
    setSelectedChartStock(stock);
    setChartData(getHistoricalData(stock.symbol));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Market Overview</h2>
          <p className="text-muted-foreground mt-1">Real-time financial intelligence & AI insights</p>
        </div>
        <Button onClick={handleGenerateSummary} disabled={isGenerating} variant="outline" className="gap-2">
          {isGenerating ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} className="text-yellow-500" />}
          Refresh AI Insights
        </Button>
      </div>

      {/* AI Insight Card */}
      <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Zap size={120} />
        </div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
          <Zap size={18} className="text-primary" />
          Roshnet AI Daily Digest
        </h3>
        <p className="text-muted-foreground leading-relaxed max-w-4xl">
          {aiSummary || "Initializing AI Analysis..."}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {selectedChartStock.name} 
                  <span className="text-sm font-normal text-muted-foreground">({selectedChartStock.symbol})</span>
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold">${selectedChartStock.price}</span>
                  <span className={`flex items-center text-sm ${selectedChartStock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {selectedChartStock.change >= 0 ? <TrendingUp size={14} className="mr-1"/> : <TrendingDown size={14} className="mr-1"/>}
                    {selectedChartStock.change > 0 ? '+' : ''}{selectedChartStock.change} ({selectedChartStock.changePercent}%)
                  </span>
                </div>
              </div>
              <Button size="sm" onClick={() => onSelectStock(selectedChartStock)}>
                Deep Dive <ArrowRight size={14} className="ml-2" />
              </Button>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#52525b" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#52525b" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fafafa' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent News */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Latest Market News</h3>
            <div className="space-y-4">
              {MOCK_NEWS.map((news) => (
                <div key={news.id} className="flex gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className={`w-1 h-full rounded-full bg-${news.sentiment === 'positive' ? 'green' : news.sentiment === 'negative' ? 'red' : 'gray'}-500 flex-shrink-0`} />
                  <div>
                    <h4 className="font-medium text-sm text-foreground">{news.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{news.summary}</p>
                    <div className="flex gap-2 mt-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                      <span>{news.source}</span>
                      <span>•</span>
                      <span>{news.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Watchlist / Side Panel */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Watchlist</h3>
              <Button size="sm" variant="ghost"><Activity size={14}/></Button>
            </div>
            <div className="space-y-2">
              {MOCK_STOCKS.map((stock) => (
                <div 
                  key={stock.symbol}
                  onClick={() => handleStockClick(stock)}
                  className={`p-3 rounded-lg border border-transparent hover:bg-accent cursor-pointer transition-all ${selectedChartStock.symbol === stock.symbol ? 'bg-accent border-primary/20' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-sm">{stock.symbol}</span>
                      <p className="text-xs text-muted-foreground truncate max-w-[100px]">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${stock.price}</p>
                      <p className={`text-xs ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.change > 0 ? '+' : ''}{stock.changePercent}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-xl p-6">
             <h3 className="font-semibold mb-2 text-indigo-400">Upgrade to Pro</h3>
             <p className="text-xs text-muted-foreground mb-4">Get real-time alerts, unlimited AI deep dives, and advanced charting.</p>
             <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Upgrade Plan</Button>
          </div>
        </div>

      </div>
    </div>
  );
};
