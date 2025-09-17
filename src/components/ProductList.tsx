import React, { useState, useEffect } from 'react';
import { Package, Calendar, Search, Grid, List } from 'lucide-react';
import { Product, ProductFilter, ProductGroup } from '../types/Product';
import { loadProductsFromSupabase, filterProductsFromSupabase, groupProductsBySku } from '../utils/supabaseStorage';
import { FilterPanel } from './FilterPanel';
import { ProductCard } from './ProductCard';
import { ProductGroupCard } from './ProductGroupCard';

interface ProductListProps {
  refreshTrigger: number;
}

type ViewMode = 'grouped' | 'individual';
export const ProductList: React.FC<ProductListProps> = ({ refreshTrigger }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<ProductGroup[]>([]);
  const [filters, setFilters] = useState<ProductFilter>({});
  const [viewMode, setViewMode] = useState<ViewMode>('grouped');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [refreshTrigger]);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  useEffect(() => {
    const grouped = groupProductsBySku(filteredProducts);
    setGroupedProducts(grouped);
  }, [filteredProducts]);
  const loadProducts = async () => {
    try {
      setLoading(true);
      const loadedProducts = await loadProductsFromSupabase();
      setProducts(loadedProducts);
      setFilteredProducts(loadedProducts);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const hasActiveFilters = Object.values(filters).some(value => value);
      
      if (hasActiveFilters) {
        const filtered = await filterProductsFromSupabase(filters);
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(products);
      }
    } catch (error) {
      console.error('Erro ao filtrar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: ProductFilter) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const handleProductUpdate = () => {
    loadProducts();
  };
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Search className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Consultar Produtos</h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {viewMode === 'grouped' 
              ? `${groupedProducts.length} SKU${groupedProducts.length !== 1 ? 's' : ''} (${filteredProducts.length} produto${filteredProducts.length !== 1 ? 's' : ''})`
              : `${filteredProducts.length} produto${filteredProducts.length !== 1 ? 's' : ''}`
            }
          </span>
        </div>
        
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
          <button
            onClick={() => setViewMode('grouped')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'grouped'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Grid className="w-4 h-4" />
            Agrupado
          </button>
          <button
            onClick={() => setViewMode('individual')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'individual'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <List className="w-4 h-4" />
            Individual
          </button>
        </div>
      </div>

      <FilterPanel
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Carregando produtos...</p>
        </div>
      )}

      {!loading && filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">
            {products.length === 0 
              ? 'Nenhum produto cadastrado ainda' 
              : 'Nenhum produto encontrado com os filtros aplicados'
            }
          </p>
        </div>
      ) : !loading ? (
        viewMode === 'grouped' ? (
          <div className="space-y-6">
            {groupedProducts.map(group => (
              <ProductGroupCard
                key={group.sku}
                group={group}
                onUpdate={handleProductUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onUpdate={handleProductUpdate}
                onDelete={handleProductUpdate}
              />
            ))}
          </div>
        )
      ) : null}
    </div>
  );
};