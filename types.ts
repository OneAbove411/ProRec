export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  sentimentScore: number; // 0-100
  reliabilityScore: number; // 0-100
  brandTrustScore: number; // 0-100
  pricePerformance: {
    rating: number; // 0-10
    tier: 'Budget' | 'Value' | 'Premium' | 'Overpriced';
  };
  redditSummary: {
    pros: string[];
    cons: string[];
    topPraises: string[];
    topComplaints: string[];
    verdict: string;
  };
  sources: {
    name: string;
    url: string;
    price?: number;
  }[];
  specs: Record<string, string>;
  releaseDate?: string;
  popularity: number; // 0-100 for bubble size
}

export interface SearchState {
  query: string;
  loading: boolean;
  results: Product[];
  error?: string;
  mode: 'dashboard' | 'detail';
  selectedProductId?: string;
  filters: {
    maxPrice: number;
    category?: string;
  };
}

export interface Deal {
  id: string;
  title: string;
  code?: string;
  discount: string;
  expires: string;
}