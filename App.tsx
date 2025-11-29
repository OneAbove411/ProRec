import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { 
  RedditTrustWidget, 
  CategoryInsightsWidget, 
  TopRecommendationsWidget,
  BrandTrustWidget,
} from './components/Widgets';
import { ProductDetail } from './components/ProductDetail';
import { IconSearch } from './components/Icons';
import { recommendProducts } from './services/gemini';
import { Product, SearchState } from './types';

// Updated with real-looking images from Unsplash
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Sony WH-1000XM5 Wireless",
    category: "Audio",
    price: 26990,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop",
    sentimentScore: 88,
    reliabilityScore: 92,
    brandTrustScore: 95,
    popularity: 90,
    pricePerformance: { rating: 8.5, tier: 'Premium' },
    redditSummary: {
      pros: ["Industry leading ANC", "Lightweight design"],
      cons: ["Auto ANC can be annoying", "No water resistance"],
      topPraises: ["ANC is pure magic", "Comfortable for 8 hours", "Call quality improved"],
      topComplaints: ["Gets warm on ears", "Hinge feels fragile", "Price hike over XM4"],
      verdict: "The king of commuter headphones."
    },
    sources: [{ name: "Amazon.in", url: "#", price: 26990 }],
    specs: { Driver: "30mm", Battery: "30 Hours" }
  },
  {
    id: "2",
    name: "Soundcore Space Q45",
    category: "Audio",
    price: 7999,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop",
    sentimentScore: 92,
    reliabilityScore: 85,
    brandTrustScore: 82,
    popularity: 75,
    pricePerformance: { rating: 9.5, tier: 'Value' },
    redditSummary: {
      pros: ["Great value ANC", "LDAC support"],
      cons: ["Bulky case", "Bass heavy default"],
      topPraises: ["Best ANC under 10k", "Battery lasts forever", "App is excellent"],
      topComplaints: ["Earcups slightly small", "Wind noise outdoors", "Plastic build"],
      verdict: "Best budget alternative to Sony."
    },
    sources: [{ name: "Flipkart", url: "#", price: 7999 }],
    specs: { Driver: "40mm", Battery: "50 Hours" }
  },
  {
    id: "3",
    name: "Sennheiser Momentum 4",
    category: "Audio",
    price: 24990,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1000&auto=format&fit=crop",
    sentimentScore: 89,
    reliabilityScore: 88,
    brandTrustScore: 92,
    popularity: 60,
    pricePerformance: { rating: 8.8, tier: 'Premium' },
    redditSummary: {
      pros: ["Best in class sound", "60hr battery"],
      cons: ["Touch controls finicky", "Firmware bugs"],
      topPraises: ["Soundstage is wide", "Battery is insane", "Looks premium"],
      topComplaints: ["Connection drops occasionally", "On-head detection buggy", "Case is huge"],
      verdict: "For audiophiles who want wireless."
    },
    sources: [{ name: "Amazon.in", url: "#", price: 24990 }],
    specs: { Driver: "42mm", Battery: "60 Hours" }
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [search, setSearch] = useState<SearchState>({
    query: '',
    loading: false,
    results: INITIAL_PRODUCTS,
    mode: 'dashboard',
    filters: { maxPrice: 100000 }
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.query.trim()) return;

    setSearch(prev => ({ ...prev, loading: true }));
    try {
      const products = await recommendProducts(search.query);
      setSearch(prev => ({ 
        ...prev, 
        loading: false, 
        results: products 
      }));
    } catch (error) {
      console.error(error);
      setSearch(prev => ({ ...prev, loading: false }));
    }
  };

  const handleProductSelect = (product: Product) => {
    setSearch(prev => ({ 
      ...prev, 
      selectedProductId: product.id,
      mode: 'detail' 
    }));
  };

  const selectedProduct = search.results.find(p => p.id === search.selectedProductId);

  // Render content
  const renderContent = () => {
    // Flexbox Layout for robustness
    return (
      <div className="flex flex-col md:flex-row h-full gap-6 px-2 md:px-0 pb-6">
        
        {/* Left Column (Metrics) - 25% width on desktop */}
        <div className="w-full md:w-1/4 flex flex-col gap-6 shrink-0">
           <div className="h-[340px] md:h-[55%]">
              <RedditTrustWidget products={search.results} />
           </div>
           <div className="h-[220px] md:flex-1">
              <BrandTrustWidget score={search.results[0]?.brandTrustScore || 85} />
           </div>
        </div>

        {/* Right Section (Recommendations & Market Position) - Remaining width */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
           {/* Recommendations - Takes available space */}
           <div className="flex-1 min-h-[400px]">
              <TopRecommendationsWidget products={search.results} onSelect={handleProductSelect} />
           </div>
           
           {/* Market Position - Fixed height bottom section */}
           <div className="h-[280px] shrink-0">
              <CategoryInsightsWidget products={search.results} onSelect={handleProductSelect} />
           </div>
        </div>
      </div>
    );
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      
      {/* Header Bar */}
      <div className="shrink-0 flex flex-col md:flex-row items-center gap-6 px-6 py-6 md:px-10 md:pt-10 z-40 relative">
         <div className="w-full md:w-auto flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight drop-shadow-md">ProRec</h1>
         </div>
         
         <div className="w-full md:max-w-2xl mx-auto relative group">
            {/* Perfectly centered icon */}
            <div className="absolute top-1/2 left-5 -translate-y-1/2 pointer-events-none z-10">
                <IconSearch className="w-5 h-5 text-textMuted group-focus-within:text-neonGreen transition-colors drop-shadow-lg" />
            </div>
            
            <form onSubmit={handleSearch} className="relative flex items-center w-full">
              <input 
                type="text" 
                placeholder="Search products, categories, or brands..." 
                className="
                  w-full bg-[#1A1A1A]/60 backdrop-blur-md text-white font-medium text-sm rounded-[2rem] pl-12 pr-6 py-4 
                  border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] 
                  focus:border-neonGreen/50 focus:bg-[#1A1A1A]/80 focus:outline-none focus:shadow-[0_0_20px_rgba(163,255,71,0.15)] 
                  transition-all duration-300 placeholder:text-textMuted/70
                "
                value={search.query}
                onChange={(e) => setSearch(prev => ({...prev, query: e.target.value}))}
              />
            </form>
         </div>
         
         {/* Spacer to balance title width on desktop */}
         <div className="hidden md:block w-32"></div>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:px-10 md:pb-10 custom-scrollbar">
        {search.loading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="relative">
               <div className="w-16 h-16 border-4 border-white/10 rounded-full"></div>
               <div className="w-16 h-16 border-4 border-neonGreen border-t-transparent rounded-full animate-spin absolute inset-0 shadow-[0_0_20px_rgba(163,255,71,0.5)]"></div>
            </div>
            <div className="mt-6 text-white font-display text-xl font-bold tracking-widest animate-pulse">ANALYZING MARKET...</div>
          </div>
        ) : (
          renderContent()
        )}
      </div>

      {/* Product Detail Modal */}
      {search.mode === 'detail' && selectedProduct && (
        <ProductDetail 
          product={selectedProduct} 
          onClose={() => setSearch(prev => ({ ...prev, mode: 'dashboard' }))} 
        />
      )}
    </Layout>
  );
}