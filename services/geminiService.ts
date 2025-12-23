import { GoogleGenAI, Type } from "@google/genai";

/**
 * 强健的 JSON 数据提取器：能从 AI 的自然语言回复中精准抠出 JSON 内容
 */
const parseRobust = (text: string | undefined): any => {
  if (!text) return null;
  try {
    const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = clean.indexOf('{');
    const firstBracket = clean.indexOf('[');
    let startIdx = -1;
    let endIdx = -1;

    if (firstBrace !== -1 && (firstBracket === -1 || (firstBrace < firstBracket && firstBrace !== -1))) {
      startIdx = firstBrace;
      endIdx = clean.lastIndexOf('}');
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
      endIdx = clean.lastIndexOf(']');
    }

    if (startIdx !== -1 && endIdx !== -1) {
      const jsonStr = clean.substring(startIdx, endIdx + 1).replace(/'/g, '"');
      return JSON.parse(jsonStr);
    }
    return null;
  } catch (e) {
    console.error("Data Parse Error:", e);
    return null;
  }
};

/**
 * 实时同步全球汇率数据
 */
export const fetchExchangeRate = async (from: string = 'CNY', to: string = 'USD'): Promise<number> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search today's real-time exchange rate for 1 ${from} to ${to} (BOC or Google Finance). Return ONLY the numeric value. Example: 0.1382`,
      config: { tools: [{ googleSearch: {} }] },
    });
    const text = response.text || "";
    const matches = text.match(/\d+(\.\d+)?/g);
    const rates = matches?.map(Number).filter(n => n !== 1 && n > 0 && n < 1000) || [];
    return rates.length > 0 ? rates[0] : (from === 'CNY' ? 0.1382 : 7.23);
  } catch (error) { 
    return from === 'CNY' ? 0.1382 : 7.23; 
  }
};

/**
 * 联网获取 MSRP 指导价
 */
export const fetchMSRP = async (brand: string, model: string, year: string = "", trim: string = "", isUsed: boolean = false): Promise<{ price: number, source: string } | null> => {
  if (!brand || !model) return null;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const query = isUsed 
    ? `搜索 ${year}款 ${brand} ${model} ${trim} 在中国的真实二手车行情价（人民币）。直接给出价格数字。` 
    : `搜索 ${year}款 ${brand} ${model} ${trim} 在中国的官方指导价MSRP（人民币）。直接给出价格数字。`;
    
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: query,
      config: { tools: [{ googleSearch: {} }], temperature: 0 },
    });
    
    const text = response.text || "";
    let price = 0;
    const wanMatch = text.match(/(\d+(\.\d+)?)\s*[万wW]/);
    if (wanMatch) {
      price = Math.round(parseFloat(wanMatch[1]) * 10000);
    } else {
      const nums = text.replace(/,/g, '').match(/\d{5,8}/g);
      if (nums) {
        const valid = nums.map(Number).filter(n => n > 5000 && n < 20000000);
        if (valid.length > 0) price = valid[0];
      }
    }

    const source = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.find(c => c.web?.uri)?.web?.uri || "https://www.dongchedi.com";
    return price > 0 ? { price, source } : null;
  } catch (error) {
    return null;
  }
};

/**
 * 实时同步品牌下的所有车型列表
 */
export const fetchCarModels = async (brand: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search and list all active car series/models currently sold under brand "${brand}" in China. Return a JSON array of strings ONLY: ["ModelA", "ModelB"].`,
      config: { tools: [{ googleSearch: {} }] }
    });
    const result = parseRobust(response.text);
    return Array.isArray(result) ? result : [];
  } catch (error) { 
    return []; 
  }
};

/**
 * 实时同步具体款式配置
 */
export const fetchCarTrims = async (brand: string, model: string, year: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search and list all trims/configurations for ${year} ${brand} ${model} in China. Return a JSON array of strings ONLY.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    const result = parseRobust(response.text);
    return Array.isArray(result) ? result : [];
  } catch (error) { 
    return []; 
  }
};

/**
 * 获取车型官方配色
 */
export const fetchCarColors = async (brand: string, model: string, year: string, trim: string): Promise<{exterior: string[], interior: string[]}> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search available official exterior and interior color names for ${year} ${brand} ${model} ${trim}. Return as JSON: {"exterior":[], "interior":[]}`,
      config: { tools: [{ googleSearch: {} }] }
    });
    const result = parseRobust(response.text);
    return result || {exterior: [], interior: []};
  } catch (error) { 
    return {exterior: [], interior: []}; 
  }
};

export const identifyCarFromImages = async (base64Images: string[]): Promise<{ brand: string; model: string; year: string } | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          ...base64Images.map(data => ({ inlineData: { mimeType: "image/jpeg", data } })),
          { text: "Identify car brand, model, and year. Return JSON ONLY: {'brand':'','model':'','year':''}" }
        ]
      }
    });
    return parseRobust(response.text);
  } catch (error) { return null; }
};

export const identifyVINFromImage = async (base64Image: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [{ inlineData: { mimeType: "image/jpeg", data: base64Image } }, { text: "Extract 17-digit VIN code from this image. Return code only." }]
      }
    });
    const vin = response.text?.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    return (vin && vin.length === 17) ? vin : null;
  } catch (error) { return null; }
};
