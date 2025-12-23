import { GoogleGenAI, Type } from "@google/genai";

/**
 * 健壮的 JSON 对象解析：自动处理 AI 的碎碎念和 Markdown 代码块
 */
const parseJsonRobust = (text: string | undefined): any => {
  if (!text) return null;
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0].replace(/'/g, '"');
      return JSON.parse(jsonStr);
    }
    return null;
  } catch (e) {
    console.error("JSON Parse Error:", e);
    return null;
  }
};

/**
 * 健壮的 JSON 数组解析
 */
const parseJsonArrayRobust = (text: string | undefined): string[] => {
  if (!text) return [];
  try {
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      const jsonStr = arrayMatch[0].replace(/'/g, '"');
      const arr = JSON.parse(jsonStr);
      return Array.isArray(arr) ? arr : [];
    }
    return [];
  } catch (e) {
    console.error("Array Parse Error:", e);
    return [];
  }
};

/**
 * 实时汇率抓取
 */
export const fetchExchangeRate = async (from: string = 'CNY', to: string = 'USD'): Promise<number> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search today's real-time exchange rate: 1 ${from} to ${to}. Return ONLY the float number. Example: 0.1382`,
      config: { tools: [{ googleSearch: {} }] },
    });
    
    const text = response.text || "";
    const matches = text.match(/\d+(\.\d+)?/g);
    // 过滤掉数字 1，获取第一个汇率值
    const rates = matches?.map(Number).filter(n => n !== 1 && n > 0 && n < 1000) || [];
    return rates.length > 0 ? rates[0] : (from === 'CNY' ? 0.1382 : 7.23);
  } catch (error) { 
    return from === 'CNY' ? 0.1382 : 7.23; 
  }
};

/**
 * MSRP 指导价检索
 */
export const fetchMSRP = async (brand: string, model: string, year: string = "", trim: string = "", isUsed: boolean = false): Promise<{ price: number, source: string } | null> => {
  if (!brand || !model) return null;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const query = isUsed 
    ? `搜索 ${year}款 ${brand} ${model} ${trim} 在中国的二手车行情价格（人民币）。` 
    : `搜索 ${year}款 ${brand} ${model} ${trim} 在中国的官方指导价MSRP（人民币）。`;
    
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: query,
      config: { tools: [{ googleSearch: {} }] },
    });
    
    const text = response.text || "";
    let price = 0;
    
    // 匹配“XX万”
    const wanMatch = text.match(/(\d+(\.\d+)?)\s*[万wW]/);
    if (wanMatch) {
      price = Math.round(parseFloat(wanMatch[1]) * 10000);
    } else {
      const nums = text.replace(/,/g, '').match(/\d+/g);
      if (nums) {
        const valid = nums.map(Number).filter(n => n > 5000);
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
 * 抓取品牌下的所有车型列表
 */
export const fetchCarModels = async (brand: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search and list all car series/models currently on sale for brand "${brand}" in China. Return a JSON array of strings ONLY: ["ModelA", "ModelB"]`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return parseJsonArrayRobust(response.text);
  } catch (error) { 
    return []; 
  }
};

/**
 * 抓取特定车型的具体配置款式
 */
export const fetchCarTrims = async (brand: string, model: string, year: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `List all configurations/trims for ${year} ${brand} ${model} in China. Return a JSON array of strings ONLY.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return parseJsonArrayRobust(response.text);
  } catch (error) { 
    return []; 
  }
};

export const fetchCarColors = async (brand: string, model: string, year: string, trim: string): Promise<{exterior: string[], interior: string[]}> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search colors for ${year} ${brand} ${model} ${trim}. Return JSON: {"exterior":[], "interior":[]}`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return parseJsonRobust(response.text) || {exterior: [], interior: []};
  } catch (error) { return {exterior: [], interior: []}; }
}

export const identifyCarFromImages = async (base64Images: string[]): Promise<{ brand: string; model: string; year: string } | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          ...base64Images.map(data => ({ inlineData: { mimeType: "image/jpeg", data } })),
          { text: "Identify car. Return JSON: {'brand':'','model':'','year':''}" }
        ]
      }
    });
    return parseJsonRobust(response.text);
  } catch (error) { return null; }
};

export const identifyVINFromImage = async (base64Image: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [{ inlineData: { mimeType: "image/jpeg", data: base64Image } }, { text: "Extract 17-digit VIN." }]
      }
    });
    const vin = response.text?.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    return (vin && vin.length === 17) ? vin : null;
  } catch (error) { return null; }
};
