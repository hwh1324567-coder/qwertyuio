import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, AlertTriangle, CheckCircle2, Clock, 
  MapPin, ShieldAlert, TrendingUp, Activity, FileText,
  ChevronRight, Filter
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';

// --- Mock Data ---

const metricData1 = [{ name: '1', value: 400 }, { name: '2', value: 300 }, { name: '3', value: 550 }, { name: '4', value: 480 }, { name: '5', value: 700 }, { name: '6', value: 850 }, { name: '7', value: 1284 }];
const metricData2 = [{ name: '1', value: 20 }, { name: '2', value: 22 }, { name: '3', value: 25 }, { name: '4', value: 28 }, { name: '5', value: 30 }, { name: '6', value: 32 }, { name: '7', value: 34.2 }];
const metricData3 = [{ name: '1', value: 10 }, { name: '2', value: 15 }, { name: '3', value: 12 }, { name: '4', value: 20 }, { name: '5', value: 18 }, { name: '6', value: 25 }, { name: '7', value: 30 }];
const metricData4 = [{ name: '1', value: 4000 }, { name: '2', value: 4500 }, { name: '3', value: 4200 }, { name: '4', value: 5000 }, { name: '5', value: 6000 }, { name: '6', value: 7500 }, { name: '7', value: 8420 }];

const riskModelData = [
  { name: '异常跨区流动', value: 98 },
  { name: '历史违规高频', value: 85 },
  { name: '虚假许可证', value: 76 },
  { name: '资金流向异常', value: 65 },
  { name: '销量异常波动', value: 54 },
];

const todoList = [
  { id: 1, type: '车辆核查', desc: '苏A88***轨迹异常', time: '10:30', priority: 'high' },
  { id: 2, type: '线索研判', desc: '张某某大额资金流转', time: '11:15', priority: 'high' },
  { id: 3, type: '实地检查', desc: '南京市鼓楼区某零售户', time: '14:00', priority: 'medium' },
  { id: 4, type: '案件审批', desc: '关于李某非法经营案', time: '15:30', priority: 'medium' },
  { id: 5, type: '模型优化', desc: '调整"虚假许可证"阈值', time: '16:45', priority: 'low' },
  { id: 6, type: '数据复核', desc: '无锡市上月销量异常库', time: '17:00', priority: 'low' },
];

const mapPoints = [
  { id: 1, x: 30, y: 40, type: 'warning' },
  { id: 2, x: 50, y: 60, type: 'clue' },
  { id: 3, x: 70, y: 30, type: 'warning' },
  { id: 4, x: 45, y: 75, type: 'clue' },
  { id: 5, x: 60, y: 50, type: 'warning' },
  { id: 6, x: 20, y: 65, type: 'clue' },
  { id: 7, x: 80, y: 80, type: 'warning' },
  { id: 8, x: 35, y: 25, type: 'clue' },
];

// --- Components ---

const WarningModal = ({ isOpen, onClose, data }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="text-rose-500" size={20} />
            实时预警详情
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto max-h-[70vh]">
          {data?.type === 'list' ? (
            <div className="space-y-4">
              <p className="text-slate-600 mb-4">今日共产生 1,284 条预警，以下为最新高危预警：</p>
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-100 rounded-lg">
                  <div className="mt-0.5"><AlertTriangle size={16} className="text-rose-500"/></div>
                  <div>
                    <div className="font-medium text-slate-800">异常跨区流动预警 #{1000 + i}</div>
                    <div className="text-sm text-slate-600 mt-1">发现苏A88***车辆在非规定区域频繁活动，疑似违规运输。</div>
                    <div className="text-xs text-slate-400 mt-2">2026-04-02 14:{50 - i * 5}:00</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">预警类型</div>
                  <div className="font-medium text-slate-800">异常跨区流动</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">风险等级</div>
                  <div className="font-medium text-rose-600">高风险</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">发生时间</div>
                  <div className="font-medium text-slate-800">2026-04-02 14:30:00</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">坐标位置</div>
                  <div className="font-medium text-slate-800 font-mono">{data?.lat}, {data?.lng}</div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-2">预警详情</h3>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                  系统监测到目标对象在短时间内出现异常的跨区域移动轨迹，与历史正常经营行为不符。结合资金流向模型分析，存在较高的非法经营风险。建议立即指派稽查人员进行实地核查。
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  忽略
                </button>
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                  生成核查任务
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, trend, data, color, icon: Icon, onClick }: any) => (
  <div onClick={onClick} className={`bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md hover:border-blue-300 transition-all ${onClick ? 'cursor-pointer' : ''}`}>
    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon size={80} color={color} />
    </div>
    <div className="flex justify-between items-start z-10">
      <div className="text-slate-500 text-sm font-medium flex items-center gap-2">
        <Icon size={16} color={color} />
        {title}
      </div>
      <div className={`text-xs font-bold px-2 py-1 rounded bg-opacity-10 ${trend.startsWith('+') ? 'text-emerald-600 bg-emerald-100' : 'text-rose-600 bg-rose-100'}`}>
        {trend}
      </div>
    </div>
    <div className="flex items-end justify-between mt-2 z-10">
      <div className="text-3xl font-bold text-slate-800 tracking-tight">
        {value}
      </div>
      <div className="w-24 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const FunnelChart = () => {
  const data = [
    { name: '实时预警', value: 12840, color: '#3b82f6' },
    { name: '有效线索', value: 4391, color: '#8b5cf6' },
    { name: '立案查处', value: 156, color: '#10b981' },
  ];
  
  const maxVal = data[0].value;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-800 font-semibold flex items-center gap-2">
          <Filter size={18} className="text-blue-500" />
          业务转化漏斗
        </h3>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center gap-2 w-full px-4">
        {data.map((item, index) => {
          const width = Math.max((item.value / maxVal) * 100, 15);
          return (
            <div key={item.name} className="w-full flex flex-col items-center relative group">
              <div 
                className="h-12 flex items-center justify-center relative transition-all duration-500 ease-out"
                style={{ 
                  width: `${width}%`, 
                  backgroundColor: `${item.color}15`,
                  border: `1px solid ${item.color}40`,
                  clipPath: index === 0 ? 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' : 
                            index === 1 ? 'polygon(5% 0, 95% 0, 85% 100%, 15% 100%)' : 
                                          'polygon(15% 0, 85% 0, 70% 100%, 30% 100%)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent"></div>
                <span className="text-slate-800 font-bold z-10">{item.value.toLocaleString()}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1 mb-2">{item.name}</div>
              {index < data.length - 1 && (
                <div className="absolute -bottom-3 text-[10px] text-slate-500 bg-white px-2 rounded-full border border-slate-200 z-20 shadow-sm">
                  转化率: {((data[index+1].value / item.value) * 100).toFixed(1)}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MapSection = () => {
  const mapRef = React.useRef<any>(null);

  useEffect(() => {
    const initMap = () => {
      if (!(window as any).L) {
        setTimeout(initMap, 100);
        return;
      }
      
      const L = (window as any).L;
      const mapContainer = document.getElementById('map-container');
      
      if (mapContainer && !mapRef.current) {
        const map = L.map('map-container').setView([26.105920, 119.276824], 15);
        mapRef.current = map;
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add markers for mapPoints
        mapPoints.forEach(point => {
          // Map abstract coordinates (0-100) to roughly Fuzhou area
          const lat = 25.9 + ((100 - point.y) / 100) * 0.4;
          const lng = 119.0 + (point.x / 100) * 0.5;
          
          const color = point.type === 'warning' ? '#f43f5e' : '#3b82f6';
          
          const markerHtml = `
            <div style="
              width: 14px; 
              height: 14px; 
              background-color: ${color}; 
              border-radius: 50%; 
              box-shadow: 0 0 8px ${color};
              border: 2px solid white;
            "></div>
          `;
          
          const icon = L.divIcon({
            html: markerHtml,
            className: 'custom-leaflet-marker',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });
          
          const marker = L.marker([lat, lng], { icon }).addTo(map);
          
          if (point.type === 'warning') {
            marker.on('click', () => {
              window.dispatchEvent(new CustomEvent('open-warning-modal', { detail: { ...point, lat: lat.toFixed(4), lng: lng.toFixed(4) } }));
            });
          } else {
            marker.bindPopup(`<b>线索追踪</b><br>坐标: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
        });
      }
    };
    
    initMap();
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col relative">
      {/* Search Bar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="relative shadow-sm rounded-lg">
          <input 
            type="text" 
            placeholder="输入人/车/证号智搜..." 
            className="w-full bg-white/90 border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 backdrop-blur-md"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <div className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded cursor-pointer transition-colors">
            搜索
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2 bg-white/90 p-3 rounded-lg border border-slate-200 backdrop-blur-md text-xs shadow-sm">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1 -m-1 rounded transition-colors"
          onClick={() => window.dispatchEvent(new CustomEvent('open-warning-modal', { detail: { type: 'list' } }))}
        >
          <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse"></div>
          <span className="text-slate-600 font-medium">实时预警</span>
        </div>
        <div className="flex items-center gap-2 p-1 -m-1">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
          <span className="text-slate-600">有效线索</span>
        </div>
      </div>

      {/* Leaflet Map Container */}
      <div id="map-container" className="flex-1 mt-12 relative rounded-lg overflow-hidden border border-slate-200 z-10">
      </div>
    </div>
  );
};

export default function App() {
  const [warningModalConfig, setWarningModalConfig] = useState<{isOpen: boolean, data: any}>({ isOpen: false, data: null });

  useEffect(() => {
    const handleOpenModal = (e: any) => {
      setWarningModalConfig({ isOpen: true, data: e.detail });
    };
    window.addEventListener('open-warning-modal', handleOpenModal);
    return () => window.removeEventListener('open-warning-modal', handleOpenModal);
  }, []);

  return (
    <div className="h-screen w-full bg-slate-100 text-slate-800 p-4 font-sans overflow-hidden flex flex-col">
      <WarningModal 
        isOpen={warningModalConfig.isOpen} 
        onClose={() => setWarningModalConfig({isOpen: false, data: null})} 
        data={warningModalConfig.data} 
      />
      {/* Header */}
      <header className="flex justify-between items-center mb-4 px-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-sm">
            <ShieldAlert size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-600 tracking-wider">
            江苏烟草智慧监管数据看板
          </h1>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <Clock size={14} className="text-blue-500" />
            <span className="font-medium">2026-04-02 14:57:34</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] animate-pulse"></div>
            <span className="text-emerald-600 font-medium">系统运行正常</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left: Map (40%) */}
        <div className="w-[40%] bg-white border border-slate-200 rounded-xl p-4 flex flex-col relative overflow-hidden shadow-sm">
          <MapSection />
        </div>

        {/* Right Content (60%) */}
        <div className="w-[60%] flex flex-col gap-4">
          {/* Top: Metrics */}
          <div className="grid grid-cols-4 gap-4 h-[120px] shrink-0">
            <MetricCard 
              title="今日预警" 
              value="1,284" 
              trend="+12%" 
              data={metricData1} 
              color="#ef4444" 
              icon={AlertTriangle} 
              onClick={() => window.dispatchEvent(new CustomEvent('open-warning-modal', { detail: { type: 'list' } }))}
            />
            <MetricCard title="线索转化率" value="34.2%" trend="+2.1%" data={metricData2} color="#3b82f6" icon={Activity} />
            <MetricCard title="本月立案" value="156" trend="-5%" data={metricData3} color="#10b981" icon={CheckCircle2} />
            <MetricCard title="涉案金额(万)" value="8,420" trend="+18%" data={metricData4} color="#f59e0b" icon={TrendingUp} />
          </div>

          {/* Bottom: Analysis & Actions */}
          <div className="flex gap-4 flex-1 min-h-0">
            {/* Analysis (approx 66% of right side) */}
            <div className="w-[66%] flex flex-col gap-4">
              <div className="flex gap-4 flex-1 min-h-0">
                <div className="w-[45%] bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <FunnelChart />
                </div>
                <div className="w-[55%] bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-slate-800 font-semibold flex items-center gap-2">
                      <Activity size={18} className="text-blue-500" />
                      Top 风险模型排名
                    </h3>
                  </div>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={riskModelData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={90} />
                        <RechartsTooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                          {riskModelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#colorGradient${index})`} />
                          ))}
                        </Bar>
                        <defs>
                          {riskModelData.map((entry, index) => (
                            <linearGradient key={`colorGradient${index}`} id={`colorGradient${index}`} x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.8} />
                              <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
                            </linearGradient>
                          ))}
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions (approx 34% of right side) */}
            <div className="w-[34%] bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-800 font-semibold flex items-center gap-2">
                  <FileText size={18} className="text-blue-500" />
                  我的待办
                </h3>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-100">
                  {todoList.length} 项
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {todoList.map((todo) => (
                  <div key={todo.id} className="bg-slate-50 border border-slate-100 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          todo.priority === 'high' ? 'bg-rose-500 shadow-[0_0_4px_rgba(244,63,94,0.5)]' : 
                          todo.priority === 'medium' ? 'bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.5)]' : 
                          'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]'
                        }`}></span>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">{todo.type}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{todo.time}</span>
                    </div>
                    <div className="text-xs text-slate-500 pl-4 line-clamp-1">
                      {todo.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Global Styles for Scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
}

