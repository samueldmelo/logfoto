import React from 'react';
import { Filter, X } from 'lucide-react';
import { ProductFilter } from '../types/Product';

interface FilterPanelProps {
  filters: ProductFilter;
  onFiltersChange: (filters: ProductFilter) => void;
  onClearFilters: () => void;
}

const categorias = ['Bolsa', 'Cinto', 'Acessório', 'Carteira'];
const tamanhos = ['U', 'P', 'M', 'G', 'GG', 'XG'];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const updateFilter = (key: keyof ProductFilter, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Filtros de Pesquisa</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Limpar Filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">SKU</label>
          <input
            type="text"
            value={filters.sku || ''}
            onChange={(e) => updateFilter('sku', e.target.value)}
            placeholder="Pesquisar por SKU"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cor</label>
          <input
            type="text"
            value={filters.cor || ''}
            onChange={(e) => updateFilter('cor', e.target.value.toUpperCase())}
            placeholder="Pesquisar por cor"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Categoria</label>
          <select
            value={filters.categoria || ''}
            onChange={(e) => updateFilter('categoria', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Todas as categorias</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tamanho</label>
          <select
            value={filters.tamanho || ''}
            onChange={(e) => updateFilter('tamanho', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Todos os tamanhos</option>
            {tamanhos.map(tam => (
              <option key={tam} value={tam}>{tam}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Data Início</label>
          <input
            type="date"
            value={filters.dataInicio || ''}
            onChange={(e) => updateFilter('dataInicio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Data Fim</label>
          <input
            type="date"
            value={filters.dataFim || ''}
            onChange={(e) => updateFilter('dataFim', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};