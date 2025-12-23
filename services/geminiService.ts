
import { GoogleGenAI, Type } from "@google/genai";

/**
 * 健壮的 JSON 对象解析：寻找第一个 { 和最后一个 }
 */
const parseJsonRobust = (text: string | undefined): any => {
  if (!text) return null;
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      const jsonStr = text.substring(start, end + 1).replace(/'/g, '"');
      return JSON.parse(jsonStr);
    }
    return null;
  } catch (e) {
    console.error("JSON Parse Error:", e, "Raw Text:", text);
    return null;
  }
};

/**
 * 健壮的 JSON 数组解析：寻找第一个 [ 和最后一个 ]
 */
const parseJsonArrayRobust = (text: string | undefined): string[] => {
  if (!text) return [];
  try {
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
      const jsonStr = text.substring(start, end + 1).replace(/'/g, '"');
      const arr = JSON.parse(jsonStr);
      return Array.isArray(arr) ? arr : [];
    }
    return [];
  } catch (e) {
    console.error("Array Parse Error:", e, "Raw Text:", text);
    return [];
  }
};

/**
 * 实时汇率抓取：精准提取非 1 数字
 */
export const fetchExchangeRate = async (from: string = 'CNY', to: string = 'USD'): Promise<number> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search today's exchange rate: 1 ${from} to ${to}. Return ONLY the numeric value (e.g. 0.1382).`,
      config: { tools: [{ googleSearch: {} }] },
    });
    
    // 排除数字 1，提取汇率值
    const matches = response.text?.match(/\d+(\.\d+)?/g);
    const rates = matches?.map(Number).filter(n => n !== 1 && n > 0) || [];
    const rate = rates.length > 0 ? rates[0] : (from === 'CNY' ? 0.1382 : 7.23);
    return rate;
  } catch (error) { 
    console.error("Rate Fetch Failed:", error);
    return from === 'CNY' ? 0.1382 : 7.23; 
  }
};

/**
 * MSRP 检索：增强搜索溯源
 */
export const fetchMSRP = async (brand: string, model: string, year: string = "", trim: string = "", isUsed: boolean = false): Promise<{ price: number, source: string } | null> => {
  if (!brand || !model) return null;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const query = isUsed 
    ? `检索 ${year}款 ${brand} ${model} ${trim} 在中国的二手车零售行情价（人民币元）。` 
    : `检索 ${year}款 ${brand} ${model} ${trim} 的官方指导价（MSRP，人民币元）。参考懂车帝。`;
    
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: query,
      config: { tools: [{ googleSearch: {} }], temperature: 0 },
    });
    
    const text = response.text || "";
    let price = 0;
    const wanMatch = text.match(/(\d+(\.\d+)?)\s*[万wW]/i);
    if (wanMatch) {
      price = Math.round(parseFloat(wanMatch[1]) * 10000);
    } else {
      const nums = text.replace(/,/g, '').match(/\d+/g);
      if (nums) {
        const valid = nums.map(n => parseInt(n)).filter(n => n > 5000 && n < 20000000);
        if (valid.length > 0) price = valid[0];
      }
    }

    const source = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.[0]?.web?.uri || "https://www.dongchedi.com";
    return price > 0 ? { price, source } : null;
  } catch (error) {
    return null;
  }
};

export const fetchCarModels = async (brand: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `List all car series for brand "${brand}" currently on sale in China. Return as a plain JSON string array: ["Model1", "Model2"].`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return parseJsonArrayRobust(response.text);
  } catch (error) { 
    console.error("Fetch Models Error:", error);
    return []; 
  }
};

export const fetchCarTrims = async (brand: string, model: string, year: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `List all specific trims/configurations for ${year} ${brand} ${model}. Return as a plain JSON string array.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return parseJsonArrayRobust(response.text);
  } catch (error) { return []; }
};

export const fetchCarColors = async (brand: string, model: string, year: string, trim: string): Promise<{exterior: string[], interior: string[]}> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Official colors for ${year} ${brand} ${model} ${trim}. JSON: {"exterior":[], "interior":[]}`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return parseJsonRobust(response.text) || {exterior: [], interior: []};
  } catch (error) { return {exterior: [], interior: []}; }
}

export const identifyCarFromImages = async (base64Images: string[]): Promise<{ brand: string; model: string; year: string } | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: {
        parts: [
          ...base64Images.map(data => ({ inlineData: { mimeType: "image/jpeg", data } })),
          { text: "Identify car make, model, and year. JSON: {'brand':'','model':'','year':''}" }
        ]
      },
      config: { tools: [{ googleSearch: {} }] }
    });
    return parseJsonRobust(response.text);
  } catch (error) { return null; }
};

export const identifyVINFromImage = async (base64Image: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [{ inlineData: { mimeType: "image/jpeg", data: base64Image } }, { text: "Extract 17-digit VIN." }]
      }
    });
    const vin = response.text?.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    return (vin && vin.length === 17) ? vin : null;
  } catch (error) { return null; }
};
