import React, { useState } from 'react';
import { Package, Calendar, Edit2, Trash2, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Product } from '../types/Product';
import { updateProductInSupabase, deleteProductFromSupabase } from '../utils/supabaseStorage';

interface ProductCardProps {
  product: Product;
  onUpdate: () => void;
  onDelete: () => void;
}

const categorias = ['Bolsa', 'Cinto', 'Acessório', 'Carteira'];
const tamanhos = ['U', 'P', 'M', 'G', 'GG', 'XG'];

export const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    sku: product.sku,
    categoria: product.categoria,
    tamanho: product.tamanho,
    cor: product.cor
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProductInSupabase(product.id, editData);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        setLoading(true);
        await deleteProductFromSupabase(product.id);
        onDelete();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditData({
      sku: product.sku,
      categoria: product.categoria,
      tamanho: product.tamanho,
      cor: product.cor
    });
    setIsEditing(false);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">SKU</label>
            <input
              type="text"
              value={editData.sku}
              onChange={(e) => setEditData(prev => ({ ...prev, sku: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria</label>
            <select
              value={editData.categoria}
              onChange={(e) => setEditData(prev => ({ ...prev, categoria: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tamanho</label>
            <select
              value={editData.tamanho}
              onChange={(e) => setEditData(prev => ({ ...prev, tamanho: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {tamanhos.map(tam => (
                <option key={tam} value={tam}>{tam}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Cor</label>
            <input
              type="text"
              value={editData.cor}
              onChange={(e) => setEditData(prev => ({ ...prev, cor: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-semibold text-gray-500">SKU</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
            {product.categoria}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Editar produto"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
            title="Excluir produto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-3">{product.sku}</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Tamanho:</span>
          <span className="font-semibold">{product.tamanho}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Cor:</span>
          <span className="font-semibold">{product.cor}</span>
        </div>
      </div>

      <div className="border-t pt-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Cadastrado em:</span>
        </div>
        <p className="text-sm text-gray-700 mt-1">
          {formatDateTime(product.dataHoraCadastro)}
        </p>
      </div>
    </div>
  );
};