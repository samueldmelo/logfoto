import React, { useState } from 'react';
import { Package, Calendar, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { ProductGroup } from '../types/Product';
import { ProductCard } from './ProductCard';

interface ProductGroupCardProps {
  group: ProductGroup;
  onUpdate: () => void;
}

export const ProductGroupCard: React.FC<ProductGroupCardProps> = ({ group, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const latestProduct = group.products[0];
  const colors = [...new Set(group.products.map(p => p.cor))];
  const sizes = [...new Set(group.products.map(p => p.tamanho))];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header do grupo */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-semibold text-gray-500">SKU</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {group.categoria}
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              {group.totalVariations} variação{group.totalVariations !== 1 ? 'ões' : ''}
            </span>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{group.sku}</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-sm text-gray-600 block mb-1">Cores disponíveis:</span>
            <div className="flex flex-wrap gap-1">
              {colors.map(cor => (
                <span key={cor} className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-700 border">
                  {cor}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-600 block mb-1">Tamanhos disponíveis:</span>
            <div className="flex flex-wrap gap-1">
              {sizes.map(tamanho => (
                <span key={tamanho} className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-700 border">
                  {tamanho}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Último cadastro: {formatDateTime(latestProduct.dataHoraCadastro)}</span>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Ocultar Variações
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Ver Variações
              </>
            )}
          </button>
        </div>
      </div>

      {/* Lista de variações */}
      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onUpdate={onUpdate}
                onDelete={onUpdate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};