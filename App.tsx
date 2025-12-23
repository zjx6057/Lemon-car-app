import React, { useState, useEffect } from 'react';
import { QuoteCalculator } from './components/QuoteCalculator';

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<'new' | 'used' | null>(null);

  // Mandatory check for API key selection when using high-quality models like gemini-3-pro-image-preview
  useEffect(() => {
    const checkApiKey = async () => {
      // @ts-ignore: window.aistudio injected in the environment
      if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
        // @ts-ignore: window.aistudio injected in the environment
        await window.aistudio.openSelectKey();
      }
    };
    checkApiKey();
  }, []);

  return (
    <div className="min-h-screen">
      {appMode ? (
        <QuoteCalculator 
          carType={appMode} 
          onBack={() => setAppMode(null)} 
        />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-6">
          <div className="text-center mb-4">
            <h1 className="text-6xl font-black italic tracking-tighter text-slate-900">
              LEMON <span className="text-yellow-600">EXPORT</span>
            </h1>
            <p className="font-black text-slate-400 mt-2 tracking-[0.3em] uppercase">
              汽车出口报价系统
            </p>
          </div>
          
          <div className="w-full max-w-sm space-y-4">
            <button 
              onClick={() => setAppMode('new')} 
              className="w-full p-8 bg-white border-4 border-slate-950 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left hover:scale-[1.02] active:scale-95 transition-all"
            >
              <div className="text-3xl font-black mb-1 text-slate-900">新车出口</div>
              <div className="text-slate-500 font-bold text-xs uppercase tracking-widest">New Car Export</div>
            </button>
            
            <button 
              onClick={() => setAppMode('used')} 
              className="w-full p-8 bg-white border-4 border-slate-950 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] text-left hover:scale-[1.02] active:scale-95 transition-all"
            >
              <div className="text-3xl font-black mb-1 text-blue-900">二手车出口</div>
              <div className="text-slate-500 font-bold text-xs uppercase tracking-widest">Used Car Export</div>
            </button>
          </div>

          <div className="mt-8 text-center opacity-30">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Lemon Car Global Logistics & Trading Solutions
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
