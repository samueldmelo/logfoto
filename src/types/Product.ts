export interface Product {
  id: string;
  sku: string;
  categoria: string;
  tamanho: string;
  cor: string;
  dataHoraCadastro: string;
}

export interface ProductGroup {
  sku: string;
  categoria: string;
  products: Product[];
  totalVariations: number;
}

export type ProductFilter = {
  sku?: string;
  cor?: string;
  tamanho?: string;
  categoria?: string;
  dataInicio?: string;
  dataFim?: string;
}