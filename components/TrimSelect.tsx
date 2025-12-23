
import React from 'react';

interface TrimSelectProps {
  trims: string[];
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
  disabled: boolean;
}

export const TrimSelect: React.FC<TrimSelectProps> = ({ trims, value, onChange, loading, disabled }) => {
  return (
    <div className="relative group">
      <label className="block text-sm font-black text-black mb-2">
        款式配置 (Style/Trim)
        {loading && <span className="ml-2 text-xs font-black text-yellow-800 animate-pulse">加载中...</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || loading}
          className={`appearance-none block w-full rounded-xl border-2 p-4 pr-10 text-black shadow-md focus:border-yellow-700 focus:ring-2 focus:ring-yellow-400 transition-all duration-200 text-base font-black cursor-pointer bg-white
            ${disabled ? 'bg-gray-200 border-gray-400 text-gray-800 cursor-not-allowed' : 'border-yellow-600 bg-white hover:border-yellow-700'}
          `}
        >
          <option value="" className="text-black bg-white font-black">
            {loading ? '查询配置中...' : disabled ? '请先选择车型' : '请选择具体款式'}
          </option>
          {trims.map((trim, index) => (
            <option key={`${trim}-${index}`} value={trim} className="text-black bg-white font-black py-2">
              {trim}
            </option>
          ))}
          {!loading && !disabled && trims.length > 0 && (
              <option value="custom_input" className="text-black font-black bg-gray-100 italic">手动输入配置...</option>
          )}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
           {loading ? (
             <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
           ) : (
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
             </svg>
           )}
        </div>
      </div>
    </div>
  );
};
