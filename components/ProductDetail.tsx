import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';

export const ProductDetail = ({ product, onClose }: { product: Product, onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md p-8 overflow-y-auto"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <button onClick={onClose} className="text-textMuted hover:text-white flex items-center gap-2">
            ← Back to Dashboard
          </button>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full border border-white/10 text-xs uppercase tracking-widest text-textMuted">
              {product.category}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Image & Quick Stats */}
          <div className="md:col-span-4 space-y-6">
            <div className="aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10 relative group">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-4 right-4 bg-neonGreen text-black font-bold px-3 py-1 rounded-full text-sm">
                {product.sentimentScore} / 100
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface rounded-2xl p-4 border border-white/5">
                <div className="text-textMuted text-xs uppercase tracking-wider mb-1">Reliability</div>
                <div className="text-2xl font-display font-bold text-white">{product.reliabilityScore}%</div>
              </div>
              <div className="bg-surface rounded-2xl p-4 border border-white/5">
                <div className="text-textMuted text-xs uppercase tracking-wider mb-1">Price Analysis</div>
                <div className="text-2xl font-display font-bold text-neonOrange">Fair</div>
              </div>
            </div>
          </div>

          {/* Right Column: Details, Reddit, Buying Options */}
          <div className="md:col-span-8 space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 text-xl text-textMuted">
                <span>₹{product.price.toLocaleString('en-IN')}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                <span className="text-neonGreen">In Stock</span>
              </div>
            </div>

            {/* Reddit Intelligence */}
            <div className="bg-surface rounded-3xl p-6 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-neonOrange rounded-full"></span>
                Reddit Consensus
              </h3>
              <p className="text-textMain mb-6 italic border-l-2 border-neonOrange pl-4">
                "{product.redditSummary.verdict}"
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-bold text-neonGreen mb-3 uppercase tracking-wider">Pros</h4>
                  <ul className="space-y-2">
                    {product.redditSummary.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-textMuted">
                        <span className="text-neonGreen mt-1">+</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-400 mb-3 uppercase tracking-wider">Cons</h4>
                  <ul className="space-y-2">
                    {product.redditSummary.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-textMuted">
                        <span className="text-red-400 mt-1">-</span> {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {Object.entries(product.specs).map(([key, val]) => (
                 <div key={key} className="bg-white/5 rounded-xl p-3">
                    <div className="text-[10px] text-textMuted uppercase">{key}</div>
                    <div className="text-sm text-white font-medium truncate">{val}</div>
                 </div>
               ))}
            </div>

            {/* Buying Options */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider mb-2">Available At</h3>
              {product.sources.map((source, i) => (
                <div key={i} className="flex items-center justify-between bg-surfaceHighlight hover:bg-white/10 transition-colors p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">
                       {source.name[0]}
                     </div>
                     <div>
                       <div className="font-bold text-white">{source.name}</div>
                       <div className="text-xs text-textMuted">Trusted Partner</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                       <div className="text-lg font-bold text-white">₹{source.price?.toLocaleString('en-IN')}</div>
                    </div>
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white text-black hover:bg-neonGreen transition-colors px-6 py-2 rounded-xl font-bold text-sm"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};