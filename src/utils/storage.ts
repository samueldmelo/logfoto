import { Product } from '../types/Product';

const STORAGE_KEY = 'logfoto_produtos';

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const loadProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addProduct = (product: Omit<Product, 'id' | 'dataHoraCadastro'>): Product => {
  const products = loadProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    dataHoraCadastro: new Date().toISOString(),
    cor: product.cor.toUpperCase() // Sempre salvar em CAIXA ALTA
  };
  
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};