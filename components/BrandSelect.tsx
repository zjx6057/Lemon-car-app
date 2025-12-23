
import React, { useState, useMemo } from 'react';
import { CAR_BRANDS, SORTED_CATEGORIES } from '../constants';
import { CarBrandCategory } from '../types';

interface BrandSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const BrandSelect: React.FC<BrandSelectProps> = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBrands = useMemo(() => {
    if (!searchTerm) return CAR_BRANDS;
    return CAR_BRANDS.filter(b => 
      b.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const categoriesToRender = useMemo(() => {
    return SORTED_CATEGORIES.filter(category => 
      filteredBrands.some(b => b.category === category)
    );
  }, [filteredBrands]);

  return (
    <div className="relative group">
      <label className="block text-sm font-black text-black mb-2 flex justify-between items-center">
        <span>汽车品牌 (Brand)</span>
      </label>
      
      <div className="mb-3 relative">
        <input 
          type="text"
          placeholder="搜索品牌..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm p-3 rounded-xl border-2 border-black bg-white focus:border-yellow-600 focus:ring-0 transition-all font-black text-black shadow-sm"
        />
      </div>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none block w-full rounded-xl border-4 border-black bg-white p-4 pr-10 text-black shadow-md focus:border-yellow-700 transition-all duration-200 text-base font-black cursor-pointer"
        >
          <option value="" className="text-black bg-white font-black">请选择品牌</option>
          {categoriesToRender.map((category) => {
            const brands = filteredBrands.filter((b) => b.category === category);
            if (brands.length === 0) return null;
            return (
              <optgroup 
                key={category} 
                label={category} 
                className="font-black text-black bg-gray-100"
              >
                {brands.map((brand) => (
                  <option 
                    key={brand.value} 
                    value={brand.value}
                    className="py-2 text-black bg-white font-black"
                  >
                    {brand.label}
                  </option>
                ))}
              </optgroup>
            );
          })}
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
