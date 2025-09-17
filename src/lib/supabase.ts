import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          sku: string;
          categoria: string;
          tamanho: string;
          cor: string;
          data_hora_cadastro: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sku: string;
          categoria: string;
          tamanho: string;
          cor: string;
          data_hora_cadastro?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sku?: string;
          categoria?: string;
          tamanho?: string;
          cor?: string;
          data_hora_cadastro?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};