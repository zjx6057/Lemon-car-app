
import React from 'react';

interface YearSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const YearSelect: React.FC<YearSelectProps> = ({ value, onChange, disabled }) => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear + 1;
  const endYear = 2000;
  
  const years = Array.from(
    { length: startYear - endYear + 1 }, 
    (_, i) => (startYear - i).toString()
  );

  return (
    <div className="relative group">
      <label className="block text-sm font-black text-black mb-2 flex justify-between">
        <span>年份 (Year)</span>
        {!disabled && <span className="text-[10px] text-black font-black opacity-60">{endYear}-{startYear}</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`appearance-none block w-full rounded-xl border-2 p-4 pr-10 text-black shadow-md focus:border-yellow-700 focus:ring-2 focus:ring-yellow-400 transition-all duration-200 text-base font-black cursor-pointer bg-white
            ${disabled ? 'bg-gray-200 border-gray-400 text-gray-800 cursor-not-allowed' : 'border-yellow-600 bg-white hover:border-yellow-700'}
          `}
        >
          {years.map((year) => (
            <option key={year} value={year} className="font-black text-black bg-white">
              {year} 款
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
           <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
             </svg>
        </div>
      </div>
    </div>
  );
};
