const fs = require('fs');
const file = 'src/api/audit.ts';
let code = fs.readFileSync(file, 'utf8');

const replacement = `
export interface HomeKpiResponse {
  gmv: number;
  
  total_sellers: number;
  active_sellers: number;
  registered_sellers?: number;
  active_new_sellers?: number;

  total_buyers: number;
  active_buyers: number;
  registered_buyers?: number;
  active_new_buyers?: number;

  total_products: number;
  new_products?: number;
  total_auctions: number;
  auctions_done?: number;
  total_money?: number;
  
  top_tags_gmv?: {
    tag_id: number;
    name_ar: string | null;
    name_en: string | null;
    gmv: number;
    transactions_count: number;
    products_count: number;
  }[];

  advanced_sellers?: {
    total: number;
    active: number;
    registered_in_period: number;
    active_new_in_period: number;
    country_breakdown: any[];
  };

  advanced_buyers?: {
    total: number;
    active: number;
    registered_in_period: number;
    active_new_in_period: number;
    country_breakdown: any[];
  };

  advanced_products?: {
    total: number;
    new_in_period: number;
    country_breakdown: any[];
  };

  advanced_auctions?: {
    outcomes: {
      outcome: string;
      products_count: number;
      country_id: number;
      country_code: string;
      country_name: any;
    }[];
  };

  total_inspections: {
    total: number;
    offline: number;
    online: number;
  };
  total_bids: number;
  total_bidders: number;
  all_clients_count?: number;
  new_clients: {
    id: number;
    name: string;
    image: string | null;
    joined_at: string;
    phone?: string | null;
  }[];
}
`;

code = code.replace(/export interface HomeKpiResponse \{[\s\S]*?\}\n/, replacement.trim() + '\n');
fs.writeFileSync(file, code);
