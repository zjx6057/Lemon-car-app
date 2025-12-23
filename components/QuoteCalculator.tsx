
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { BrandSelect } from './BrandSelect';
import { ModelSelect } from './ModelSelect';
import { YearSelect } from './YearSelect';
import { TrimSelect } from './TrimSelect';
import { ResultCard } from './ResultCard';
import { DetailedAnalysisView } from './DetailedAnalysisView';
import { 
  fetchExchangeRate, 
  fetchMSRP, 
  fetchCarModels, 
  fetchCarTrims, 
  fetchCarColors,
  identifyCarFromImages,
  identifyVINFromImage
} from '../services/geminiService';
import { CurrencyOption } from '../types';
import { EXPORT_CURRENCIES, CAR_BRANDS, CHINA_EXPORT_PORTS, GLOBAL_DESTINATION_PORTS } from '../constants';

const AppInput: React.FC<{ 
  label: string; 
  value: string; 
  onChange: (val: string) => void; 
  placeholder?: string; 
  tip?: string;
  currencySymbol?: string;
  disabled?: boolean;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  autoFocus?: boolean;
  type?: string;
  step?: string;
  className?: string;
}> = ({ label, value, onChange, placeholder = "0.00", tip, currencySymbol = "¥", disabled = false, onAction, actionIcon, autoFocus, type = "number", step, className = "" }) => (
  <div className={`bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${disabled ? 'bg-slate-50 opacity-90' : 'active:border-yellow-600 focus-within:border-yellow-500 focus-within:shadow-[5px_5px_0px_0px_rgba(234,179,8,1)]'} ${className}`}>
    <div className="flex justify-between items-center mb-1">
      <label className="text-[10px] font-black text-slate-950 uppercase tracking-tight">{label}</label>
      {tip && <span className="text-[9px] text-blue-900 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{tip}</span>}
    </div>
    <div className="relative flex items-center">
      {type === "number" && <span className="absolute left-0 text-slate-950 font-black text-xl">{currencySymbol}</span>}
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder} 
        disabled={disabled}
        autoFocus={autoFocus}
        step={step || (type === "number" ? "0.01" : undefined)}
        className={`w-full bg-transparent py-1 ${type === "number" ? 'pl-7 text-right' : 'pl-0 text-left'} text-xl font-oswald font-black text-slate-950 outline-none placeholder:text-slate-400`} 
      />
      {onAction && (
        <button onClick={onAction} className="ml-2 p-2.5 bg-yellow-500 text-slate-950 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-90 transition-all">
          {actionIcon || <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>}
        </button>
      )}
    </div>
  </div>
);

const SectionCard: React.FC<{ title: string; children: React.ReactNode; color: string; icon?: React.ReactNode }> = ({ title, children, color, icon }) => (
  <div className="mb-8 bg-white rounded-[2rem] border-[3px] border-slate-950 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
    <div className={`${color} px-6 py-4 border-b-[3px] border-slate-950 flex items-center gap-3`}>
      <div className="p-2 bg-white/40 rounded-lg border border-slate-950/20">{icon}</div>
      <h2 className="text-lg font-black text-slate-950 uppercase tracking-tighter">{title}</h2>
    </div>
    <div className="p-5 space-y-5">
      {children}
    </div>
  </div>
);

interface QuoteCalculatorProps {
  carType: 'new' | 'used';
  onBack: () => void;
}

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({ carType, onBack }) => {
  const currentYear = new Date().getFullYear();
  const isUsed = carType === 'used';
  
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState((currentYear).toString());
  const [trim, setTrim] = useState('');
  const [exteriorColor, setExteriorColor] = useState('');
  const [interiorColor, setInteriorColor] = useState('');
  const [vin, setVin] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [discountPrice, setDiscountPrice] = useState(''); 
  const [invoicePriceInput, setInvoicePriceInput] = useState(''); 
  const [purchaseTax, setPurchaseTax] = useState(''); 
  const [taxRefund, setTaxRefund] = useState(''); 
  const [profitUSD, setProfitUSD] = useState(''); 
  const [departurePort, setDeparturePort] = useState(CHINA_EXPORT_PORTS[1]);
  const [destinationPort, setDestinationPort] = useState(GLOBAL_DESTINATION_PORTS[1]);
  const [oceanFreight, setOceanFreight] = useState('');
  const [insuranceFee, setInsuranceFee] = useState(''); 
  const [domesticFreight, setDomesticFreight] = useState('1500'); 
  const [registrationFee, setRegistrationFee] = useState(isUsed ? '800' : '500'); 
  const [compulsoryInsuranceFee, setCompulsoryInsuranceFee] = useState('950'); 
  const [channelFee, setChannelFee] = useState('1000'); 
  const [portMiscFee, setPortMiscFee] = useState('2600'); 
  const [customsFee, setCustomsFee] = useState('500'); 
  const [otherServiceFee, setOtherServiceFee] = useState(''); 
  const [hasUsedTaxRefund, setHasUsedTaxRefund] = useState<'yes' | 'no'>(isUsed ? 'no' : 'yes');
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [trimOptions, setTrimOptions] = useState<string[]>([]);
  const [colorOptions, setColorOptions] = useState<{exterior: string[], interior: string[]}>({exterior: [], interior: []});
  const [modelsLoading, setModelsLoading] = useState(false);
  const [trimsLoading, setTrimsLoading] = useState(false);
  const [colorsLoading, setColorsLoading] = useState(false);
  const [msrpLoading, setMsrpLoading] = useState(false);
  const [msrpResult, setMsrpResult] = useState<{ price: number; source: string } | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState<'car' | 'vin'>('car');
  const [sourceCurrency, setSourceCurrency] = useState<CurrencyOption>(EXPORT_CURRENCIES.find(c => c.code === 'CNY')!);
  const [targetCurrency, setTargetCurrency] = useState<CurrencyOption>(EXPORT_CURRENCIES.find(c => c.code === 'USD')!);
  const [exchangeRate, setExchangeRate] = useState(0.1382); 
  const [rateLoading, setRateLoading] = useState(false);
  const [calculationResults, setCalculationResults] = useState<{ exw: number; fob: number; cif: number } | null>(null);
  const [loading, setLoading] = useState(false);

  // Quote Modal State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showQuotePreview, setShowQuotePreview] = useState(false);
  const [quoteType, setQuoteType] = useState<'EXW' | 'FOB' | 'CIF'>('CIF');
  const [shipDate, setShipDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('30');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const qtyValue = Math.max(1, parseInt(quantity) || 1);

  const refreshRate = useCallback(async () => {
    setRateLoading(true);
    try {
      const rate = await fetchExchangeRate(sourceCurrency.code, targetCurrency.code);
      if (rate && !isNaN(rate) && rate > 0) setExchangeRate(rate);
    } catch (e) {
      console.error("Exchange Rate Sync Failure:", e);
    } finally {
      setRateLoading(false);
    }
  }, [sourceCurrency.code, targetCurrency.code]);

  useEffect(() => { refreshRate(); }, [sourceCurrency.code, targetCurrency.code, refreshRate]);

  const handleBrandChange = (newBrand: string) => {
    setBrand(newBrand); setModel(''); setTrim(''); setExteriorColor(''); setInteriorColor('');
    setMsrpResult(null); setInvoicePriceInput(''); setPurchaseTax(''); setTaxRefund('');
  };

  const handleYearChange = (newYear: string) => {
    setYear(newYear); setTrim(''); setMsrpResult(null); setInvoicePriceInput('');
  };

  useEffect(() => { 
    if (brand) { 
      setModelsLoading(true); 
      fetchCarModels(brand).then(m => { 
        setModelOptions(m); 
        setModelsLoading(false); 
      }).catch(() => setModelsLoading(false));
    } 
  }, [brand]);

  useEffect(() => { 
    if (brand && model && year) { 
      setTrimsLoading(true); 
      fetchCarTrims(brand, model, year).then(t => { 
        setTrimOptions(t); 
        setTrimsLoading(false); 
      }).catch(() => setTrimsLoading(false));
    } 
  }, [brand, model, year]);

  useEffect(() => { 
    if (brand && model && trim && year) { 
      setColorsLoading(true); 
      fetchCarColors(brand, model, year, trim).then(c => { 
        setColorOptions(c); 
        setColorsLoading(false); 
      }).catch(() => setColorsLoading(false));
    } 
  }, [brand, model, trim, year]);

  const syncMarketPrice = useCallback(async () => {
    if (!brand || !model) return;
    setMsrpLoading(true);
    const res = await fetchMSRP(brand, model, year, trim, isUsed);
    if (res) setMsrpResult(res);
    setMsrpLoading(false);
  }, [brand, model, year, trim, isUsed]);

  useEffect(() => {
    if (msrpResult?.price) {
      const disc = parseFloat(discountPrice) || 0;
      setInvoicePriceInput(Math.max(0, msrpResult.price - disc).toString());
    }
  }, [msrpResult, discountPrice]);

  useEffect(() => {
    const inv = parseFloat(invoicePriceInput) || 0;
    if (!isUsed) {
      setPurchaseTax((inv / 11.3).toFixed(2));
    } else {
      setPurchaseTax('0.00');
    }
    
    // 退税公式：(底价 / 1.13) * 0.13
    if (hasUsedTaxRefund === 'yes' || !isUsed) {
      const calculatedRefund = (inv / 1.13) * 0.13;
      setTaxRefund(calculatedRefund.toFixed(2));
    } else {
      setTaxRefund('0.00');
    }
  }, [invoicePriceInput, isUsed, hasUsedTaxRefund]);

  useEffect(() => { if (brand && model) syncMarketPrice(); }, [brand, model, year, trim, syncMarketPrice]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files || files.length === 0) return;
    setIsIdentifying(true);
    const base64Promises = Array.from(files).map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });
    });
    try {
      const base64Images = await Promise.all(base64Promises);
      const result = await identifyCarFromImages(base64Images);
      if (result && result.brand) {
        const brandKey = CAR_BRANDS.find(b => result.brand.toLowerCase().includes(b.label.toLowerCase()))?.value || result.brand;
        handleBrandChange(brandKey);
        setTimeout(() => { setModel(result.model); setYear(result.year); }, 200);
      }
    } finally { setIsIdentifying(false); }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState < 2) return;
    setIsIdentifying(true);
    const ctx = canvasRef.current.getContext('2d'); if (!ctx) return;
    canvasRef.current.width = videoRef.current.videoWidth; canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    const base64 = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
    setShowCamera(false); (videoRef.current.srcObject as MediaStream)?.getTracks().forEach(t => t.stop());
    try {
      const result = cameraMode === 'vin' ? await identifyVINFromImage(base64) : await identifyCarFromImages([base64]);
      if (cameraMode === 'vin' && typeof result === 'string') setVin(result);
      else if (typeof result === 'object' && result?.brand) {
        handleBrandChange(result.brand); setTimeout(() => { setModel(result.model); setYear(result.year); }, 200);
      }
    } finally { setIsIdentifying(false); }
  };

  const handleCalculate = async () => {
    setLoading(true);
    const invVal = parseFloat(invoicePriceInput) || 0;
    const taxVal = parseFloat(purchaseTax) || 0; 
    const refVal = parseFloat(taxRefund) || 0;
    const rate = exchangeRate || 0.1382;
    const profUSD = parseFloat(profitUSD) || 0;
    const profCNY = rate > 0 ? (profUSD / rate) : 0; 
    
    const regFee = parseFloat(registrationFee) || 0;
    const compFee = parseFloat(compulsoryInsuranceFee) || 0;
    const otherSvc = parseFloat(otherServiceFee) || 0;
    
    const exw_CNY_single = invVal + (isUsed ? 0 : taxVal) - refVal + regFee + compFee + profCNY + otherSvc;
    const logsDomesticTotal = (parseFloat(customsFee) || 0) + (parseFloat(portMiscFee) || 0) + (parseFloat(domesticFreight) || 0) + (parseFloat(channelFee) || 0);
    const fob_CNY_single = exw_CNY_single + logsDomesticTotal;
    
    const seaUSD = parseFloat(oceanFreight) || 0;
    const insUSD = parseFloat(insuranceFee) || 0;
    const cif_CNY_single = fob_CNY_single + (rate > 0 ? ((seaUSD + insUSD) / rate) : 0);
    
    setCalculationResults({ 
      exw: exw_CNY_single * qtyValue, 
      fob: fob_CNY_single * qtyValue, 
      cif: cif_CNY_single * qtyValue 
    });
    setLoading(false);
    setTimeout(() => {
      const el = document.getElementById('result-area');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const startCamera = (mode: 'car' | 'vin') => {
    setCameraMode(mode);
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
      setShowCamera(true); setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
    }).catch(() => alert("摄像头开启失败"));
  };

  const handleConfirmPreview = () => {
    setShowQuoteModal(false);
    setShowQuotePreview(true);
  };

  const handlePrintFinal = () => {
    window.print();
    setShowQuotePreview(false);
  };

  const currentResultValue = useMemo(() => {
    if (!calculationResults) return 0;
    if (quoteType === 'EXW') return calculationResults.exw;
    if (quoteType === 'FOB') return calculationResults.fob;
    return calculationResults.cif;
  }, [calculationResults, quoteType]);

  const QuotationDocument: React.FC<{ isPreview?: boolean }> = ({ isPreview = false }) => (
    <div className={`text-slate-900 bg-white leading-normal font-sans ${isPreview ? 'p-4 md:p-10' : 'p-12'}`}>
        <div className="flex justify-between items-end border-b-[10px] border-slate-950 pb-8 mb-10">
          <div className="flex flex-col">
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.85] text-slate-950">
              LEMON <span className="text-yellow-500">EXPORT</span>
            </h1>
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 mt-4 ml-1">
              Professional Global Automobile Quotation
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="bg-slate-950 text-white px-6 py-2 rounded-lg font-black text-2xl uppercase tracking-tighter mb-2 transform rotate-1 shadow-lg">
              {quoteType} OFFER
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase">Ref: LM-#{new Date().getTime().toString().slice(-6)}</p>
            <p className="text-xs font-bold text-slate-500 uppercase">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
          <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
            <h3 className="text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em] flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div> CONSIGNEE / CUSTOMER
            </h3>
            <p className="text-3xl font-black text-slate-900 leading-tight">{customerName || "VALUED GLOBAL CLIENT"}</p>
            <p className="text-lg font-bold text-slate-500 mt-2 flex items-center gap-2 italic">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
               {customerContact || "CONTACT INFORMATION TBD"}
            </p>
          </div>
          <div className="p-6 text-right">
            <h3 className="text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em] flex items-center justify-end gap-2">
               EXPORTER / SHIPPER <div className="w-1.5 h-1.5 bg-slate-950 rounded-full"></div>
            </h3>
            <p className="text-xl font-black text-slate-950">LEMON CAR EXPORT CO., LTD</p>
            <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-tight">Mainland China Headquarters</p>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5">Global Automotive Trading & Logistics Service</p>
          </div>
        </div>
        <div className="border-[4px] border-slate-950 rounded-[2.5rem] overflow-hidden mb-10 shadow-2xl">
          <div className="bg-slate-950 text-white px-8 py-4 flex justify-between items-center">
             <h3 className="text-sm font-black uppercase tracking-[0.2em]">Vehicle Identification & Technical Profile</h3>
             <span className="text-[10px] font-bold opacity-60">VERIFIED SPECIFICATIONS</span>
          </div>
          <div className="p-8 bg-white grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8">
            <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Make</span><span className="font-black text-xl text-slate-900">{brand || "N/A"}</span></div>
            <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Model</span><span className="font-black text-xl text-slate-900">{model || "N/A"}</span></div>
            <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Model Year</span><span className="font-black text-xl text-slate-900">{year}</span></div>
            <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Quantity</span><span className="font-black text-2xl text-yellow-600">x{qtyValue}</span></div>
            <div className="col-span-2 flex flex-col"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Trim / Configuration</span><span className="font-black text-lg text-slate-800 leading-tight border-l-4 border-yellow-500 pl-3">{trim || "STANDARD FACTORY CONFIGURATION"}</span></div>
            <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ext / Int Color</span><span className="font-black text-base text-slate-800 uppercase">{exteriorColor || "STD"} / {interiorColor || "STD"}</span></div>
            <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span><span className="font-black text-base text-slate-800 uppercase italic">{isUsed ? 'Certified Pre-owned' : 'Brand New'}</span></div>
            <div className="col-span-2 md:col-span-4 flex flex-col pt-4 border-t border-slate-100">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Vehicle Identification Number (VIN)</span>
               <div className="bg-slate-50 px-6 py-3 rounded-xl border border-slate-200 font-oswald text-2xl font-black tracking-[0.2em] text-slate-950">
                  {vin || "TBD - TO BE ASSIGNED UPON CONTRACT SIGNING"}
               </div>
            </div>
          </div>
        </div>
        <div className="mb-10 p-10 bg-yellow-400 rounded-[3rem] border-[6px] border-slate-950 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-950/5 rounded-full -mr-20 -mt-20"></div>
          <div className="relative z-10">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Final Quoted Price <span className="text-slate-950/40 text-xl ml-2 font-black">({quoteType})</span></h3>
                <div className="bg-slate-950 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">Guaranteed Estimate</div>
             </div>
             <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col">
                   <div className="text-8xl md:text-9xl font-oswald font-black text-slate-950 tracking-tighter leading-[0.8]">
                      {sourceCurrency.symbol}{currentResultValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                   </div>
                   <p className="text-sm font-black text-slate-800 uppercase mt-4 tracking-widest italic opacity-80">Total Value in {sourceCurrency.code}</p>
                </div>
                <div className="flex flex-col text-right">
                   <div className="text-4xl md:text-6xl font-oswald font-bold text-slate-950/60 leading-none">
                      {targetCurrency.symbol}{(currentResultValue * exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                   </div>
                   <p className="text-[10px] font-black text-slate-800 uppercase mt-2 tracking-widest">Equiv. In {targetCurrency.code}</p>
                </div>
             </div>
             <div className="mt-10 pt-6 border-t-2 border-slate-950/10 flex justify-between items-center">
                <span className="text-[11px] font-black uppercase text-slate-900 opacity-60">Exchange Basis: 1 {sourceCurrency.code} = {exchangeRate.toFixed(4)} {targetCurrency.code}</span>
                <span className="text-[11px] font-black uppercase text-slate-900">Total Units: {qtyValue}</span>
             </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-slate-400 mb-2 border-b-2 border-slate-100 pb-1 tracking-[0.3em]">Logistics & Shipment</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center bg-white p-4 rounded-2xl border-2 border-slate-100"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Port of Loading</span><span className="font-black text-lg text-slate-950">{departurePort}</span></div>
               <div className="flex justify-between items-center bg-white p-4 rounded-2xl border-2 border-slate-100"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Destination Port</span><span className="font-black text-lg text-slate-950">{destinationPort}</span></div>
               <div className="flex justify-between items-center bg-white p-4 rounded-2xl border-2 border-slate-100"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Est. Ship Date</span><span className="font-black text-lg text-slate-950 italic">{shipDate}</span></div>
               <div className="flex justify-between items-center bg-white p-4 rounded-2xl border-2 border-slate-100"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transit Period</span><span className="font-black text-lg text-slate-950">{deliveryDays} Days</span></div>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-slate-400 mb-2 border-b-2 border-slate-100 pb-1 tracking-[0.3em]">Commercial Clauses</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center bg-white p-4 rounded-2xl border-2 border-slate-100"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payment Terms</span><span className="font-black text-lg text-slate-950 uppercase">T/T 100% ADVANCE</span></div>
               <div className="bg-slate-950 p-6 rounded-[2rem] text-center shadow-xl">
                  <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest block mb-2">Offer Validity Duration</span>
                  <span className="font-black text-xl text-white">{validUntil ? validUntil.replace('T', ' ') : 'CONFIRMED BY MANAGEMENT'}</span>
               </div>
               <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic border-l-4 border-slate-200 pl-4 bg-slate-50/50 py-3 rounded-r-xl">
                  Notice: Final price confirmation is subject to space availability and local logistics costs at the time of order execution. All values are VAT included where applicable.
               </p>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-16 border-t-2 border-slate-100 flex flex-col md:flex-row justify-between items-center md:items-end gap-12">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.5em] mb-4">Digital Seal of Authenticity</p>
            <div className="w-32 h-32 md:w-40 md:h-40 border-[10px] border-slate-950/5 rounded-full flex flex-col items-center justify-center font-oswald font-black text-slate-950/10 text-xl md:text-2xl italic uppercase -rotate-12 select-none pointer-events-none">
               <span>LEMON</span>
               <span className="text-sm">CERTIFIED</span>
            </div>
          </div>
          <div className="text-center w-64 md:w-96">
            <div className="h-1 bg-slate-950 w-full mb-6"></div>
            <p className="text-sm font-black uppercase text-slate-950 tracking-[0.5em]">Authorized Signature</p>
            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase italic">Lemon Car Export Management Representative</p>
            <p className="text-[8px] font-bold text-slate-300 mt-4">LEMON EXPORT SOLUTIONS v15.5.0 - SECURITY VERIFIED</p>
          </div>
        </div>
    </div>
  );

  return (
    <div className="w-full max-w-lg mx-auto px-4 pt-4 pb-20">
      <canvas ref={canvasRef} className="hidden" />
      {showCamera && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6">
           <video ref={videoRef} autoPlay playsInline className="w-full max-w-sm rounded-[2rem] border-4 border-yellow-500 shadow-2xl" />
           <div className="mt-12 flex gap-8">
              <button onClick={() => { (videoRef.current?.srcObject as MediaStream)?.getTracks().forEach(t => t.stop()); setShowCamera(false); }} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-sm border-2 border-slate-700 active:scale-95">取消</button>
              <button onClick={handleCapture} className="w-24 h-24 bg-white rounded-full border-[10px] border-slate-600 shadow-2xl active:scale-90 transition-all"></button>
           </div>
        </div>
      )}

      {/* 实时汇率看板 */}
      <div className="mb-8 bg-slate-950 text-white rounded-[2.5rem] p-5 border-[3px] border-yellow-500 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-slate-800 rounded-2xl border-2 border-slate-700 active:scale-90 shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <div className="flex-1 text-center px-4">
            <div className="flex items-center justify-center gap-2 mb-0.5">
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest block">实时汇率参考 (BOC)</span>
              <button 
                onClick={refreshRate} 
                disabled={rateLoading}
                className={`p-1 hover:bg-slate-800 rounded-full transition-all ${rateLoading ? 'opacity-50' : ''}`}
              >
                <svg className={`w-3 h-3 text-yellow-500 ${rateLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <div className="font-oswald text-2xl font-bold tracking-tighter">
              {rateLoading ? 'LOADING...' : `1 ${sourceCurrency.code} = ${exchangeRate.toFixed(4)} ${targetCurrency.code}`}
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center pt-3 border-t border-slate-800">
           <select value={sourceCurrency.code} onChange={e => setSourceCurrency(EXPORT_CURRENCIES.find(c => c.code === e.target.value)!)} className="flex-1 bg-white text-black text-xs p-3 rounded-2xl border-2 border-slate-700 font-black">
             {EXPORT_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
           </select>
           <button onClick={() => { const t = sourceCurrency; setSourceCurrency(targetCurrency); setTargetCurrency(t); }} className="p-3 bg-yellow-500 text-slate-950 rounded-full border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:scale-90">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
           </button>
           <select value={targetCurrency.code} onChange={e => setTargetCurrency(EXPORT_CURRENCIES.find(c => c.code === e.target.value)!)} className="flex-1 bg-white text-black text-xs p-3 rounded-2xl border-2 border-slate-700 font-black">
             {EXPORT_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
           </select>
        </div>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-5xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">
          <span className="text-yellow-600">Lemon</span> Export
        </h1>
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mt-3 italic">汽车出口报价全链核算系统</p>
      </div>

      <SectionCard title="1. 本土行情及精准配置" color="bg-yellow-400" icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/></svg>}>
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-[10px] font-black uppercase text-slate-500 ml-1">VIN 智能提取</label>
          <div className="relative">
            <input type="text" value={vin} onChange={e => setVin(e.target.value.toUpperCase())} placeholder="输入 17 位 VIN 码" className="w-full bg-slate-50 border-2 border-slate-950 p-4 rounded-2xl font-black text-slate-950 outline-none shadow-inner" />
            <button onClick={() => startCamera('vin')} className="absolute right-3 top-3 p-2 bg-yellow-500 text-slate-950 rounded-xl shadow-md border-2 border-slate-950 active:scale-90 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg></button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button onClick={() => startCamera('car')} className="py-4 bg-white text-slate-950 border-2 border-slate-950 rounded-2xl font-black text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95">AI 拍照识车</button>
          <button onClick={() => fileInputRef.current?.click()} className="py-4 bg-white text-slate-950 border-2 border-slate-950 rounded-2xl font-black text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95">本地上传</button>
          <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
        </div>
        {isIdentifying && (
          <div className="fixed inset-0 z-[110] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center">
            <div className="w-24 h-24 border-[6px] border-yellow-500 border-t-transparent rounded-full animate-spin mb-10"></div>
            <p className="text-3xl font-black text-white italic tracking-[0.2em] uppercase">最强检索调取中</p>
          </div>
        )}
        <div className="space-y-4">
          <BrandSelect value={brand} onChange={handleBrandChange} />
          <ModelSelect models={modelOptions} value={model} onChange={setModel} loading={modelsLoading} disabled={!brand} />
          <div className="grid grid-cols-2 gap-4">
            <YearSelect value={year} onChange={handleYearChange} disabled={!model} />
            <TrimSelect trims={trimOptions} value={trim} onChange={setTrim} loading={trimsLoading} disabled={!model} />
          </div>
        </div>
        <div className="mt-5 bg-slate-950 text-white p-6 rounded-[2.5rem] border-2 border-yellow-500 space-y-2 shadow-2xl relative overflow-hidden group">
          <div className="flex justify-between items-center z-10 relative">
            <span className="text-[10px] font-black text-yellow-500/90 uppercase tracking-[0.2em] block">{isUsed ? '市场评估价' : '官方指导价 (MSRP)'}</span>
            <div className="flex items-center gap-2">
              {msrpResult?.source && (
                <a href={msrpResult.source} target="_blank" rel="noopener noreferrer" className="text-[9px] text-blue-400 underline font-black">数据来源</a>
              )}
              <button onClick={syncMarketPrice} className="text-[9px] bg-slate-800 text-white px-3 py-1.5 rounded-full font-black border border-slate-700 active:bg-yellow-500 active:text-slate-950">刷新价格</button>
            </div>
          </div>
          <div className="text-4xl font-oswald text-yellow-500 flex items-center justify-between z-10 relative">
            {msrpResult ? `¥${(msrpResult.price / 10000).toFixed(2)}万` : (msrpLoading ? '同步中...' : '等待参数确定')} 
          </div>
        </div>
        <div className="space-y-4 pt-6 border-t border-slate-200">
          {!isUsed && <AppInput label="官方优惠建议" value={discountPrice} onChange={setDiscountPrice} tip="将从指导价中扣除" />}
          <AppInput label="拟开票裸车底价" value={invoicePriceInput} onChange={setInvoicePriceInput} tip="拟开票裸车底价 = 官方指导价 - 官方优惠建议" />
          {!isUsed && <AppInput label="拟实缴购置税" value={purchaseTax} onChange={setPurchaseTax} tip="自动联动：开票价 / 11.3" />}
        </div>
        <div className="bg-slate-50 p-6 rounded-[2.5rem] border-2 border-slate-200 shadow-inner mt-4">
          <label className="text-[10px] font-black text-slate-600 uppercase block mb-4 text-center tracking-[0.3em]">中国出口退税核算 (13% 自动联动)</label>
          <div className="flex gap-4 mb-5">
            <button onClick={() => setHasUsedTaxRefund('yes')} className={`flex-1 py-4 rounded-2xl font-black text-[11px] border-2 border-slate-950 transition-all ${hasUsedTaxRefund === 'yes' ? 'bg-slate-950 text-white shadow-xl scale-[1.03]' : 'bg-white text-slate-950'}`}>享受退税</button>
            <button onClick={() => setHasUsedTaxRefund('no')} className={`flex-1 py-4 rounded-2xl font-black text-[11px] border-2 border-slate-950 transition-all ${hasUsedTaxRefund === 'no' ? 'bg-slate-950 text-white shadow-xl scale-[1.03]' : 'bg-white text-slate-950'}`}>不涉及</button>
          </div>
          <AppInput label="预估出口退税额" value={taxRefund} onChange={setTaxRefund} tip="公式：底价 / 1.13 * 13%" />
        </div>
      </SectionCard>

      <SectionCard title="2. 中国境内出口服务费" color="bg-blue-400" icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>}>
        <AppInput label={isUsed ? "过户/办证/检测" : "报牌/临牌服务费"} value={registrationFee} onChange={setRegistrationFee} />
        <AppInput label="出口专项保险/保规费" value={compulsoryInsuranceFee} onChange={setCompulsoryInsuranceFee} />
        <div className="bg-slate-950 p-7 rounded-[3rem] border-2 border-slate-800 shadow-2xl text-center">
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2">预期单台纯利润 (USD)</label>
           <div className="flex items-center justify-center text-yellow-500">
             <span className="text-3xl font-oswald font-black mr-2">$</span>
             <input type="number" value={profitUSD} onChange={e => setProfitUSD(e.target.value)} step="0.01" className="bg-transparent text-5xl font-oswald font-black outline-none w-40 text-center" />
           </div>
        </div>
        <AppInput label="报关/单证出口综合费" value={customsFee} onChange={setCustomsFee} />
        <AppInput label="国内段短驳物流费" value={domesticFreight} onChange={setDomesticFreight} />
        <AppInput label="出口通道材料费" value={channelFee} onChange={setChannelFee} />
        <AppInput label="其他杂费" value={otherServiceFee} onChange={setOtherServiceFee} />
      </SectionCard>

      <SectionCard title="3. 国际海运与全球物流" color="bg-emerald-400" icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 15V8l-7.22-3.14a1.05 1.05 0 00-.78 0L4.78 8v7l7.22 3.14c.25.11.53.11.78 0L20 15zm-8 1.1l-5.32-2.31V9.79l5.32 2.31v4.1zm1-4.1l5.32-2.31v4.1L13 16.1v-4.1zm0-1.1V6.79l5.32 2.31L13 10.9zm-1-4.11v4.11l-5.32-2.31L12 6.79z"/></svg>}>
        <div className="space-y-4">
           <div><label className="text-[10px] font-black uppercase mb-2 ml-1 block text-slate-600">中国起运口岸</label><select value={departurePort} onChange={e => setDeparturePort(e.target.value)} className="w-full bg-white border-[3px] border-slate-950 p-4 rounded-2xl font-black text-sm outline-none">{CHINA_EXPORT_PORTS.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
           <div><label className="text-[10px] font-black uppercase mb-2 ml-1 block text-slate-600">全球目的港</label><select value={destinationPort} onChange={e => setDestinationPort(e.target.value)} className="w-full bg-white border-[3px] border-slate-950 p-4 rounded-2xl font-black text-sm outline-none">{GLOBAL_DESTINATION_PORTS.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
        </div>
        <div className="bg-emerald-50 p-8 rounded-[3rem] border-2 border-emerald-200 space-y-6 shadow-inner mt-5">
           <div><label className="text-[11px] font-black text-emerald-950 block mb-2">国际海运费 (Sea Freight USD)</label><div className="flex items-center border-b-2 border-emerald-300 pb-2"><span className="text-3xl font-oswald font-black mr-2 text-emerald-950">$</span><input type="number" value={oceanFreight} onChange={e => setOceanFreight(e.target.value)} step="0.01" className="bg-transparent w-full text-4xl font-oswald font-black text-right outline-none text-emerald-950" /></div></div>
           <div><label className="text-[11px] font-black text-emerald-950 block mb-2">全程货物保险 (Insurance USD)</label><div className="flex items-center border-b-2 border-emerald-300 pb-2"><span className="text-3xl font-oswald font-black mr-2 text-emerald-950">$</span><input type="number" value={insuranceFee} onChange={e => setInsuranceFee(e.target.value)} step="0.01" className="bg-transparent w-full text-4xl font-oswald font-black text-right outline-none text-emerald-950" /></div></div>
        </div>
      </SectionCard>

      <div className="mb-12 bg-slate-950 p-8 rounded-[3.5rem] border-[5px] border-yellow-500 shadow-2xl relative overflow-hidden group">
         <div className="flex flex-col gap-8">
            <div className="px-6 border-b border-slate-800 pb-6">
               <span className="text-[11px] font-black text-yellow-500 uppercase block mb-2 tracking-[0.3em]">出口批次规模 (Qty)</span>
               <div className="flex items-center gap-5"><span className="text-white font-black text-3xl font-oswald">x</span><input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="bg-transparent text-white font-black text-6xl font-oswald w-full outline-none" /></div>
            </div>
            <button onClick={handleCalculate} disabled={loading} className="w-full py-8 bg-yellow-500 text-slate-950 rounded-[2.5rem] font-black text-2xl shadow-[0_10px_0_0_#ca8a04] active:translate-y-2 active:shadow-none transition-all uppercase flex items-center justify-center gap-5 border-2 border-slate-950 hover:bg-yellow-400">
              {loading ? <div className="w-10 h-10 border-[6px] border-slate-900 border-t-transparent rounded-full animate-spin"></div> : '生成全链出口报价摘要'}
            </button>
         </div>
      </div>

      <div id="result-area">
        {calculationResults ? (
          <SectionCard title="4. 全球出口报价最终结果" color="bg-slate-950" icon={<svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>}>
            <div className="space-y-8">
              <ResultCard title="EXW (单台报价 - 含利含税)" cnyValue={calculationResults.exw / qtyValue} usdValue={(calculationResults.exw / qtyValue) * exchangeRate} sourceCurrency={sourceCurrency} targetCurrency={targetCurrency} note="底座成本+各路杂费+利润-退税" />
              <ResultCard title="FOB (离岸总报价)" cnyValue={calculationResults.fob} usdValue={calculationResults.fob * exchangeRate} isMain sourceCurrency={sourceCurrency} targetCurrency={targetCurrency} note="EXW总计 + 境内段陆运报关" />
              <ResultCard title="CIF (到岸总报价)" cnyValue={calculationResults.cif} usdValue={calculationResults.cif * exchangeRate} isMain sourceCurrency={sourceCurrency} targetCurrency={targetCurrency} note="FOB + 海运 + 保险" />
              <div className="pt-4"><button onClick={() => setShowQuoteModal(true)} className="w-full py-6 bg-white text-slate-950 border-[4px] border-slate-950 rounded-[2rem] font-black text-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] active:scale-95 active:shadow-none uppercase flex items-center justify-center gap-4 transition-all hover:bg-slate-50"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>导出专业报价单</button></div>
            </div>
          </SectionCard>
        ) : (
          <div className="p-24 border-[6px] border-dashed border-slate-200 rounded-[3.5rem] text-center opacity-40"><p className="text-slate-400 font-black uppercase text-sm tracking-[0.4em] leading-loose italic">等待核算数据注入...<br/>Powered by Global AI Expert v15.5</p></div>
        )}
      </div>

      {/* 专业报价单采集模态框 */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-[120] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-slate-100 w-full max-w-md rounded-[3rem] border-[5px] border-slate-950 shadow-[15px_15px_0_0_rgba(0,0,0,1)] p-10 space-y-8 max-h-[95vh] overflow-y-auto">
            <div className="text-center relative">
              <button onClick={() => setShowQuoteModal(false)} className="absolute -top-4 -right-4 w-10 h-10 bg-slate-950 text-white rounded-full border-2 border-white flex items-center justify-center shadow-xl active:scale-90">&times;</button>
              <h2 className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter">确认报价单信息</h2>
              <p className="text-[11px] font-black text-yellow-600 bg-yellow-50 py-1 rounded-lg uppercase tracking-widest mt-2 border border-yellow-200">请点击并填写以下高亮区域</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase ml-1 mb-3 block">1. 选择贸易条款 (关键必选)</label>
                <div className="grid grid-cols-3 gap-3 p-2 bg-white border-[3px] border-slate-950 rounded-2xl shadow-inner">
                  {['EXW', 'FOB', 'CIF'].map(t => (
                    <button key={t} onClick={() => setQuoteType(t as any)} className={`py-4 rounded-xl font-black text-lg border-2 transition-all ${quoteType === t ? 'bg-slate-950 text-yellow-400 border-slate-950 shadow-[4px_4px_0_0_rgba(234,179,8,1)]' : 'bg-white text-slate-300 border-transparent hover:text-slate-950 hover:bg-slate-50'}`}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-5 pt-4 border-t-2 border-slate-200">
                <AppInput label="客户全称 (Customer)" value={customerName} onChange={setCustomerName} type="text" placeholder="在此输入客户/公司名称" className="bg-white border-slate-950 !p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)]" />
                <AppInput label="联系方式 (Contact)" value={customerContact} onChange={setCustomerContact} type="text" placeholder="WhatsApp / 电话 / 邮箱" className="bg-white border-slate-950 !p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)]" />
              </div>
              
              <div className="grid grid-cols-1 gap-5">
                <div className="relative">
                  <AppInput label="预计装运船期 (Ship Date)" value={shipDate} onChange={setShipDate} type="date" tip="点击右侧图标选择" className="bg-yellow-50 border-slate-950 !p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)] font-bold" />
                </div>
                <AppInput label="交货周期天数 (Delivery Days)" value={deliveryDays} onChange={setDeliveryDays} type="number" placeholder="输入天数数字" tip="通常为30天" className="bg-white border-slate-950 !p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)]" />
              </div>

              <div className="relative">
                <AppInput label="报价有效期至 (Offer Validity)" value={validUntil} onChange={setValidUntil} type="datetime-local" step="1" tip="精确到秒" className="bg-yellow-50 border-slate-950 !p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)] font-bold" />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase ml-1 mb-3 block">装运港口 (Shipping Port)</label>
                <select value={departurePort} onChange={e => setDeparturePort(e.target.value)} className="w-full bg-white border-[3px] border-slate-950 p-5 rounded-2xl font-black text-lg outline-none shadow-[6px_6px_0_0_rgba(0,0,0,1)] cursor-pointer hover:bg-slate-50 transition-colors">{CHINA_EXPORT_PORTS.map(p => <option key={p} value={p}>{p}</option>)}</select>
              </div>
            </div>

            <div className="flex gap-4 pt-8">
              <button onClick={() => setShowQuoteModal(false)} className="flex-1 py-6 bg-white text-slate-950 border-[3px] border-slate-950 rounded-[1.5rem] font-black text-lg uppercase active:scale-95 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all">返回修改</button>
              <button onClick={handleConfirmPreview} className="flex-1 py-6 bg-yellow-400 text-slate-950 border-[3px] border-slate-950 rounded-[1.5rem] font-black text-xl uppercase shadow-[8px_8px_0_0_rgba(0,0,0,1)] active:scale-95 active:shadow-none transition-all hover:bg-yellow-500">生成报价单</button>
            </div>
          </div>
        </div>
      )}

      {/* 专业报价单预览模态框 */}
      {showQuotePreview && (
        <div className="fixed inset-0 z-[130] bg-slate-900/95 backdrop-blur-2xl flex flex-col items-center justify-start p-4 md:p-8 overflow-y-auto">
          <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden mb-24 relative">
             <div className="sticky top-0 z-10 bg-slate-100/90 backdrop-blur p-4 border-b-2 border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-black">!</div>
                    <div>
                        <p className="text-xs font-black uppercase text-slate-500">Document Preview</p>
                        <p className="text-sm font-bold text-slate-950">专业报价单预览 - 确认无误后打印</p>
                    </div>
                </div>
                <div className="flex gap-3">
                   <button onClick={() => setShowQuotePreview(false)} className="px-6 py-2.5 bg-white text-slate-950 border-2 border-slate-950 rounded-xl font-black text-xs uppercase active:scale-90 transition-all">返回修改</button>
                   <button onClick={handlePrintFinal} className="px-8 py-2.5 bg-yellow-500 text-slate-950 border-2 border-slate-950 rounded-xl font-black text-xs uppercase shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:scale-90 transition-all">确认并打印</button>
                </div>
             </div>
             <div className="p-2 md:p-10 scale-[0.9] md:scale-100 origin-top">
                <QuotationDocument isPreview={true} />
             </div>
          </div>
        </div>
      )}

      {/* 隐藏的正式打印模板 (window.print 专用) */}
      <div className="printable-quote-container">
        <QuotationDocument />
      </div>
    </div>
  );
};
