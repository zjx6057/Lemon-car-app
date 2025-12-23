
import React from 'react';

interface DetailedAnalysisViewProps {
  onBack: () => void;
  brand: string;
  model: string;
}

export const DetailedAnalysisView: React.FC<DetailedAnalysisViewProps> = ({ onBack, brand, model }) => {
  return (
    <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-yellow-500 animate-fade-in mx-auto">
      <div className="bg-gray-900 p-8 text-white relative">
        <button onClick={onBack} className="absolute top-8 left-8 p-2 bg-gray-800 rounded-full hover:bg-yellow-500 hover:text-black transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <div className="text-center">
          <h2 className="text-3xl font-black mb-2">二手车价格影响深度分析</h2>
          <p className="text-yellow-500 font-bold uppercase tracking-widest">{brand} {model} 专项报告</p>
        </div>
      </div>

      <div className="p-10 space-y-12">
        {/* Section 1: Color Impact */}
        <section>
          <h3 className="text-xl font-black text-black mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-yellow-500 rounded-full"></div>
            车身颜色对残值的影响
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gray-50 border-2 border-gray-300">
              <div className="text-sm font-black text-black opacity-60 mb-2">主流色 (白/黑/灰)</div>
              <div className="text-2xl font-black text-green-900">+2% ~ +5%</div>
              <p className="text-xs text-black font-bold mt-2">受众广，流通速度快，价格最坚挺。</p>
            </div>
            <div className="p-6 rounded-2xl bg-gray-50 border-2 border-gray-300">
              <div className="text-sm font-black text-black opacity-60 mb-2">个性色 (红/蓝/金)</div>
              <div className="text-2xl font-black text-orange-900">-3% ~ -8%</div>
              <p className="text-xs text-black font-bold mt-2">受众特定，库龄通常较长，溢价空间小。</p>
            </div>
            <div className="p-6 rounded-2xl bg-gray-50 border-2 border-gray-300">
              <div className="text-sm font-black text-black opacity-60 mb-2">冷门/改色 (紫/粉/哑光)</div>
              <div className="text-2xl font-black text-red-900">-10% ~ -15%</div>
              <p className="text-xs text-black font-bold mt-2">改色需核对行驶证，冷门原漆极难出手。</p>
            </div>
          </div>
        </section>

        {/* Section 2: Transfer Frequency */}
        <section>
          <h3 className="text-xl font-black text-black mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-700 rounded-full"></div>
            过户频次的价格折损
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-blue-50 border-2 border-blue-300 rounded-2xl">
              <span className="font-black text-blue-950">一手私家车 (0过户)</span>
              <span className="font-black text-blue-900 text-lg">标杆价格 (100%)</span>
            </div>
            <div className="flex items-center justify-between p-5 bg-gray-50 border-2 border-gray-200 rounded-2xl">
              <span className="font-black text-black">过户 1 次</span>
              <span className="font-black text-black text-lg">-2,000 ~ -5,000 元</span>
            </div>
            <div className="flex items-center justify-between p-5 bg-orange-50 border-2 border-orange-300 rounded-2xl">
              <span className="font-black text-orange-950">过户 2-3 次</span>
              <span className="font-black text-orange-900 text-lg">-5% ~ -8% 总价折损</span>
            </div>
            <div className="flex flex-col gap-2 p-5 bg-red-50 border-2 border-red-300 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="font-black text-red-950">过户 4 次及以上 (多次易手)</span>
                <span className="font-black text-red-900 text-lg">折损 > 15%</span>
              </div>
              <p className="text-xs font-black text-red-800 italic">提示：需深度检测车辆骨架，评估是否存在隐藏事故或调表行为。</p>
            </div>
          </div>
        </section>

        {/* Section 4: Usage Property Impact (Newly Added) */}
        <section>
          <h3 className="text-xl font-black text-black mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-emerald-700 rounded-full"></div>
            使用性质分析 (残值分水岭)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-200 shadow-sm">
              <h4 className="text-lg font-black text-emerald-950 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011-1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                非营运 (个人/企业)
              </h4>
              <p className="text-sm font-black text-emerald-900 mb-4">行情基准：100% 残值参考</p>
              <ul className="text-xs font-bold text-emerald-800 space-y-2">
                <li>• 维护通常较好，按时 4S 店保养比例高。</li>
                <li>• 内饰磨损相对较轻，行驶路况单一。</li>
                <li>• 出口首选性质，退税流程最标准化。</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-red-50 border-2 border-red-200 shadow-sm">
              <h4 className="text-lg font-black text-red-950 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10v-4a1 1 0 011-1h2a1 1 0 011 1v4h1.05a2.5 2.5 0 014.9 0H21a1 1 0 001-1V9.674a1 1 0 00-.293-.707l-2.482-2.482A1 1 0 0018.518 6H16V5a1 1 0 00-1-1H3z"></path></svg>
                营运 / 租赁 / 网络预约出租
              </h4>
              <p className="text-sm font-black text-red-900 mb-4">行情预估：折损 30% - 60%</p>
              <ul className="text-xs font-bold text-red-800 space-y-2">
                <li>• 营运证限制（8年报废或60万公里），残值断崖。</li>
                <li>• 行驶里程高（通常年均5万公里以上），机械损耗重。</li>
                <li>• 租赁车存在“暴力驾驶”风险，内饰翻新痕迹多。</li>
                <li>• 出口价值极低，主要针对欠发达地区配件市场。</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Special Conditions */}
        <section>
          <h3 className="text-xl font-black text-black mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-red-700 rounded-full"></div>
            特殊车况一票否决项
          </h3>
          <div className="bg-red-100 rounded-3xl p-8 border-4 border-red-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-700 flex-shrink-0 flex items-center justify-center text-white font-black text-xl shadow-lg">!</div>
                <div>
                  <h4 className="font-black text-red-950 text-lg">事故车/切割车</h4>
                  <p className="text-sm text-red-900 font-bold mt-1 leading-tight">结构件受损，价格通常仅为正常行情的 50%-70%。</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-800 flex-shrink-0 flex items-center justify-center text-white font-black text-xl shadow-lg">≈</div>
                <div>
                  <h4 className="font-black text-blue-950 text-lg">泡水/火烧车</h4>
                  <p className="text-sm text-blue-900 font-bold mt-1 leading-tight">电子系统隐患极大，出口业务中此类车况通常禁止收车。</p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t-2 border-red-300 text-center">
              <p className="text-sm font-black text-red-950">提示：出口报价需严格遵循“车况真实”原则，任何隐匿重大车况的行为将导致严重的法律后果。</p>
            </div>
          </div>
        </section>
      </div>

      <div className="bg-gray-100 p-8 flex justify-center">
        <button onClick={onBack} className="px-12 py-4 bg-black text-yellow-500 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl border-2 border-yellow-500">
          返回报价系统
        </button>
      </div>
    </div>
  );
};
