import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { IconArrowRight } from './Icons';

export const Card = ({ children, className = '', title, action }: { children?: React.ReactNode; className?: string; title?: string; action?: React.ReactNode }) => (
  <div className={`
    relative overflow-hidden flex flex-col
    bg-[#121212]/40 backdrop-blur-xl 
    rounded-[2.5rem] p-6 
    border border-white/10 
    shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
    group hover:border-white/20 transition-all duration-500
    ${className}
  `}>
    {/* Noise Texture Overlay */}
    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay"></div>

    {(title || action) && (
      <div className="flex justify-between items-center mb-5 shrink-0 relative z-10">
        {title && <h3 className="text-[11px] font-display font-bold tracking-[0.25em] text-white/50 uppercase shadow-black drop-shadow-sm">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
      {children}
    </div>
  </div>
);

// Reddit Trust Score Widget
export const RedditTrustWidget = ({ products }: { products: Product[] }) => {
  if (products.length === 0) return <Card title="REDDIT TRUST SCORE"><div className="text-textMuted text-sm">No data</div></Card>;
  
  const topProduct = products[0]; 
  const sentiment = topProduct.sentimentScore;
  const negative = 100 - sentiment;

  return (
    <Card title="REDDIT TRUST SCORE" className="h-full">
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-black/20 rounded-3xl p-4 border border-white/5 shadow-inner flex flex-col justify-between h-28 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-16 h-16 bg-neonGreen/10 blur-2xl rounded-full"></div>
           <div className="text-5xl md:text-6xl font-display font-bold text-neonGreen tracking-tighter drop-shadow-[0_0_15px_rgba(163,255,71,0.3)]">{sentiment}%</div>
           <div className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Positive</div>
        </div>
        <div className="bg-black/20 rounded-3xl p-4 border border-white/5 shadow-inner flex flex-col justify-between h-28 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 blur-2xl rounded-full"></div>
           <div className="text-5xl md:text-6xl font-display font-bold text-white/90 tracking-tighter">{negative}%</div>
           <div className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Negative</div>
        </div>
      </div>
      
      <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        <div>
           <h4 className="text-[10px] font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wider opacity-80">
             <span className="w-1.5 h-1.5 rounded-full bg-neonGreen shadow-[0_0_8px_#A3FF47]"></span> Top Praises
           </h4>
           <ul className="space-y-2">
             {topProduct.redditSummary.topPraises.slice(0, 2).map((p, i) => (
               <li key={i} className="text-xs text-white/70 pl-3 border-l-2 border-white/10">{p}</li>
             ))}
           </ul>
        </div>
        <div>
           <h4 className="text-[10px] font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wider opacity-80">
             <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]"></span> Complaints
           </h4>
           <ul className="space-y-2">
             {topProduct.redditSummary.topComplaints.slice(0, 2).map((c, i) => (
               <li key={i} className="text-xs text-white/70 pl-3 border-l-2 border-white/10">{c}</li>
             ))}
           </ul>
        </div>
      </div>
    </Card>
  );
};

// Category Insights (Market Position - Expanded)
export const CategoryInsightsWidget = ({ products, onSelect }: { products: Product[], onSelect: (p: Product) => void }) => {
  return (
    <Card title="MARKET POSITION" className="h-full" action={<span className="text-[10px] text-white/40 font-bold uppercase tracking-wider flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-neonGreen animate-pulse"></span>Live View</span>}>
      <div className="flex-1 w-full flex items-center justify-center relative min-h-[160px]">
         {/* Background Grid Lines */}
         <div className="absolute inset-0 flex justify-between pointer-events-none opacity-10">
            <div className="w-px h-full bg-white"></div>
            <div className="w-px h-full bg-white"></div>
            <div className="w-px h-full bg-white"></div>
            <div className="w-px h-full bg-white"></div>
            <div className="w-px h-full bg-white"></div>
         </div>
         
         <div className="w-full h-full flex items-center justify-around px-2 md:px-12 gap-4 overflow-x-auto overflow-y-hidden custom-scrollbar pb-2">
            {products.slice(0, 5).map((p, i) => {
              const isTop = i === 0;
              // Larger sizing for visibility
              const size = isTop ? 150 : Math.max(100, 130 - (i * 10));
              
              return (
                <motion.div
                  key={p.id}
                  whileHover={{ scale: 1.15, y: -10, zIndex: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelect(p)}
                  className={`
                    rounded-full flex-shrink-0 flex flex-col items-center justify-center cursor-pointer relative group transition-all duration-500
                    ${isTop 
                      ? 'shadow-[0_20px_60px_rgba(163,255,71,0.3),inset_0_-10px_20px_rgba(0,0,0,0.3),inset_0_10px_20px_rgba(255,255,255,0.5)]' 
                      : 'shadow-[0_15px_40px_rgba(0,0,0,0.5),inset_0_-10px_20px_rgba(0,0,0,0.8),inset_0_5px_15px_rgba(255,255,255,0.15)]'
                    }
                  `}
                  style={{ 
                    width: size, 
                    height: size,
                    background: isTop 
                      ? 'radial-gradient(circle at 30% 30%, #A3FF47, #4D801E)' 
                      : 'radial-gradient(circle at 30% 30%, #404040, #121212)'
                  }}
                >
                   {/* Shine effect */}
                   <div className="absolute top-[15%] left-[15%] w-[20%] h-[20%] bg-white rounded-full blur-[8px] opacity-60"></div>
                   
                   <div className={`font-display font-bold text-sm text-center leading-none px-2 w-full truncate z-10 ${isTop ? 'text-black drop-shadow-sm' : 'text-white drop-shadow-md'}`}>
                     {p.name.split(' ')[0]}
                   </div>
                   <div className={`text-[10px] mt-2 font-bold font-mono z-10 px-2 py-0.5 rounded-full ${isTop ? 'bg-black/20 text-black' : 'bg-black/40 text-white/70'}`}>
                     ₹{(p.price/1000).toFixed(0)}k
                   </div>

                   {/* Hover Tooltip */}
                   <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[10px] text-white whitespace-nowrap z-20 pointer-events-none">
                      Click to view details
                   </div>
                </motion.div>
              );
            })}
         </div>
      </div>
    </Card>
  );
};

// Top Recommendations (3D List - Refined Alignment)
export const TopRecommendationsWidget = ({ products, onSelect }: { products: Product[], onSelect: (p: Product) => void }) => {
  return (
    <Card title="TOP RECOMMENDATIONS" className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 mt-2 custom-scrollbar">
        {products.map((p, i) => {
          const isTop = i === 0;
          return (
            <motion.div 
              key={p.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelect(p)}
              className="group cursor-pointer relative perspective-1000"
            >
              <div className={`
                flex items-center gap-5 p-4 pr-6 rounded-[2rem] transition-all duration-300
                ${isTop 
                  ? 'bg-gradient-to-r from-neonGreen to-emerald-500 shadow-[0_10px_40px_rgba(163,255,71,0.25)] scale-[1.01] border-none' 
                  : 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 hover:translate-x-1'
                }
              `}>
                 {/* Number Alignment */}
                 <div className={`text-sm font-display font-bold w-8 text-center shrink-0 ${isTop ? 'text-black' : 'text-white/30'}`}>
                   0{i + 1}
                 </div>
                 
                 <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg shrink-0 border border-white/10 relative bg-black">
                    <img src={p.image} alt="" className="w-full h-full object-cover" />
                 </div>
                 
                 <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                    <div className={`font-bold text-base truncate ${isTop ? 'text-black' : 'text-white'}`}>{p.name}</div>
                    <div className={`text-[11px] truncate flex items-center gap-2 ${isTop ? 'text-black/70' : 'text-textMuted'}`}>
                      <span className="truncate max-w-[200px] opacity-80">{p.redditSummary.verdict}</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-4 shrink-0">
                   <div className={`font-mono font-bold text-sm tracking-tight ${isTop ? 'text-black' : 'text-white'}`}>
                     ₹{p.price.toLocaleString('en-IN')}
                   </div>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 ${isTop ? 'bg-black/20 text-black' : 'bg-white/10 text-white'}`}>
                      <IconArrowRight className="w-4 h-4" />
                   </div>
                 </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

// Brand Trust Meter
export const BrandTrustWidget = ({ score }: { score: number }) => {
  const rotation = (score / 100) * 180;
  
  return (
    <Card title="BRAND TRUST" className="h-full">
      <div className="flex flex-col items-center justify-center h-full relative -mt-4">
        <div className="w-48 h-24 overflow-hidden relative">
           {/* Background Arc */}
           <div className="w-48 h-48 rounded-full border-[20px] border-white/5 absolute top-0 left-0"></div>
           {/* Active Arc */}
           <motion.div 
             initial={{ rotate: 0 }}
             animate={{ rotate: rotation }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className="w-48 h-48 rounded-full border-[20px] border-transparent border-t-neonGreen border-r-neonGreen absolute top-0 left-0 origin-center drop-shadow-[0_0_15px_rgba(163,255,71,0.4)]"
             style={{ transform: `rotate(${rotation}deg)` }} 
           ></motion.div>
        </div>
        <div className="absolute top-12 flex flex-col items-center">
           <div className="text-5xl font-display font-bold text-white drop-shadow-2xl">{score}</div>
           <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold mt-1">Trust Score</div>
        </div>
      </div>
    </Card>
  );
};