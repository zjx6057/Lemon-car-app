
export interface CalculationResult {
  exw: number;
  exwTax: number;
  fob: number;
  fobTax: number;
  msrp: number | null;
  msrpSource?: string;
}

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}

export interface CurrencyRates {
  USDCNY: number; 
  lastUpdated: Date;
}

export enum CarBrandCategory {
  HOT = "热门品牌",
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  G = "G",
  H = "H",
  I = "I",
  J = "J",
  K = "K",
  L = "L",
  M = "M",
  N = "N",
  O = "O",
  P = "P",
  Q = "Q",
  R = "R",
  S = "S",
  T = "T",
  V = "V",
  W = "W",
  X = "X",
  Y = "Y",
  Z = "Z",
}

export interface BrandOption {
  value: string;
  label: string;
  category: CarBrandCategory;
}
