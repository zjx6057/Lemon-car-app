
import React from 'react';

interface ResultCardProps {
  title: string;
  cnyValue: number;
  usdValue: number;
  isMain?: boolean;
  note?: string;
  sourceLink?: string;
  sourceCurrency?: { code: string; symbol: string };
  targetCurrency?: { code: string; symbol: string };
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  title, 
  cnyValue, 
  usdValue, 
  isMain = false, 
  note, 
  sourceCurrency = { code: 'CNY', symbol: '¥' },
  targetCurrency = { code: 'USD', symbol: '$' }
}) => {
  const formatCurrency = (val: number, symbol: string) => {
    return `${symbol}${new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(val)}`;
  };

  return (
    <div className={`rounded-[2rem] border-[3px] border-slate-950 p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${isMain ? 'bg-yellow-50' : 'bg-white'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">{title}</h3>
          {note && <span className="text-[9px] font-bold text-slate-400 italic">({note})</span>}
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border-2 border-yellow-500 shadow-md">
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-4xl font-oswald font-black text-slate-950 tracking-tight">
          {formatCurrency(cnyValue, sourceCurrency.symbol)}
        </div>
        <div className="flex items-center gap-3">
          <div className="px-2 py-0.5 bg-slate-950 text-yellow-500 text-[10px] font-black rounded-md italic shadow-sm">EXCHANGE</div>
          <div className="text-2xl font-oswald font-bold text-slate-500">
            {formatCurrency(usdValue, targetCurrency.symbol)}
          </div>
        </div>
      </div>
    </div>
  );
};
