import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { saveProductToSupabase } from '../utils/supabaseStorage';

interface ProductFormProps {
  onProductAdded: () => void;
}

const categorias = ['Bolsa', 'Cinto', 'Acessório', 'Carteira'];
const tamanhos = ['U', 'P', 'M', 'G', 'GG', 'XG'];

export const ProductForm: React.FC<ProductFormProps> = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    sku: '',
    categoria: '',
    tamanho: '',
    cor: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU é obrigatório';
    }
    if (!formData.categoria) {
      newErrors.categoria = 'Categoria é obrigatória';
    }
    if (!formData.tamanho) {
      newErrors.tamanho = 'Tamanho é obrigatório';
    }
    if (!formData.cor.trim()) {
      newErrors.cor = 'Cor é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    handleSaveProduct();
  };

  const handleSaveProduct = async () => {
    try {
      await saveProductToSupabase(formData);
      setFormData({ sku: '', categoria: '', tamanho: '', cor: '' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      onProductAdded();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      // Aqui você pode adicionar uma notificação de erro se desejar
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Plus className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Cadastrar Produto</h2>
        </div>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Produto cadastrado com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              SKU *
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.sku ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Digite o SKU do produto"
            />
            {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              value={formData.categoria}
              onChange={(e) => handleInputChange('categoria', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.categoria ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.categoria && <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tamanho *
            </label>
            <select
              value={formData.tamanho}
              onChange={(e) => handleInputChange('tamanho', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.tamanho ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione um tamanho</option>
              {tamanhos.map(tam => (
                <option key={tam} value={tam}>{tam}</option>
              ))}
            </select>
            {errors.tamanho && <p className="mt-1 text-sm text-red-600">{errors.tamanho}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cor * <span className="text-sm text-gray-500">(será convertida para CAIXA ALTA)</span>
            </label>
            <input
              type="text"
              value={formData.cor}
              onChange={(e) => handleInputChange('cor', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.cor ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Digite a cor do produto"
            />
            {formData.cor && (
              <p className="mt-1 text-sm text-gray-600">
                Será salva como: <span className="font-semibold">{formData.cor.toUpperCase()}</span>
              </p>
            )}
            {errors.cor && <p className="mt-1 text-sm text-red-600">{errors.cor}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Cadastrar Produto
          </button>
        </form>
      </div>
    </div>
  );
};