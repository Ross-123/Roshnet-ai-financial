import React, { useState, useEffect } from 'react';
import { ArrowLeft, BrainCircuit, AlertTriangle, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { Stock, AIReport } from '../types';
import { generateStockDeepDive } from '../services/gemini';
import { Button } from '../components/ui/Button';

interface StockDetailProps {
  stock: Stock;
  onBack: () => void;
}

export const StockDetail: React.FC<StockDetailProps> = ({ stock, onBack }) => {
  const [report, setReport] = useState<AIReport | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const data = await generateStockDeepDive(stock);
      setReport({ ...data, symbol: stock.symbol });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [stock]);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button variant="ghost" onClick={onBack} className="mb-4 pl-0 hover:pl-2 transition-all">
        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            {stock.symbol}
            <span className="text-lg font-normal text-muted-foreground bg-accent px-3 py-1 rounded-full">{stock.sector}</span>
          </h1>
          <h2 className="text-xl text-muted-foreground mt-1">{stock.name}</h2>
        </div>
        <div className="text-right">
          <div className="text-4xl font-mono font-bold">${stock.price}</div>
          <div className={`text-lg font-medium ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stock.change > 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border p-4 rounded-xl">
          <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Market Cap</div>
          <div className="text-lg font-semibold">{stock.marketCap}</div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl">
          <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Volume</div>
          <div className="text-lg font-semibold">{stock.volume}</div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl">
          <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">P/E Ratio</div>
          <div className="text-lg font-semibold">{stock.peRatio}</div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl">
          <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Industry</div>
          <div className="text-lg font-semibold truncate">{stock.industry}</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border bg-accent/30 flex justify-between items-center">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <BrainCircuit className="text-primary" />
            Gemini Deep Dive Analysis
          </h3>
          {loading && <span className="text-xs text-primary animate-pulse">Analyzing real-time data...</span>}
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-accent rounded w-3/4"></div>
              <div className="h-4 bg-accent rounded w-full"></div>
              <div className="h-4 bg-accent rounded w-5/6"></div>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="h-24 bg-accent rounded"></div>
                <div className="h-24 bg-accent rounded"></div>
                <div className="h-24 bg-accent rounded"></div>
              </div>
            </div>
          ) : report ? (
            <div className="space-y-8">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-foreground/90">{report.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-4 rounded-lg border ${report.rating === 'Buy' ? 'bg-green-500/10 border-green-500/50' : report.rating === 'Sell' ? 'bg-red-500/10 border-red-500/50' : 'bg-yellow-500/10 border-yellow-500/50'}`}>
                  <div className="text-sm font-medium mb-1 opacity-80">Analyst Rating</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <TrendingUp size={20} />
                    {report.rating}
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-card border-border">
                  <div className="text-sm font-medium mb-1 opacity-80 text-muted-foreground">Risk Level</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <AlertTriangle size={20} className={report.riskLevel === 'High' ? 'text-red-500' : report.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-green-500'} />
                    {report.riskLevel}
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-card border-border">
                  <div className="text-sm font-medium mb-1 opacity-80 text-muted-foreground">Sentiment Score</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <Activity size={20} className="text-blue-500" />
                    8.5/10
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Key Investment Thesis</h4>
                <ul className="space-y-2">
                  {report.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Unable to generate analysis. Please check API Key.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
