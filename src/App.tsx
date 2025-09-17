import React, { useState } from 'react';
import { Package2, Plus, Search } from 'lucide-react';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';

type ActiveTab = 'cadastro' | 'consulta';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cadastro');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProductAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Package2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">LogFoto</h1>
              <span className="text-sm text-gray-500 hidden sm:inline">
                Sistema de Cadastro de Produtos
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('cadastro')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'cadastro'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Plus className="w-4 h-4" />
              Cadastro de Produto
            </button>
            <button
              onClick={() => setActiveTab('consulta')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'consulta'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Search className="w-4 h-4" />
              Consulta de Produtos
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'cadastro' ? (
          <ProductForm onProductAdded={handleProductAdded} />
        ) : (
          <ProductList refreshTrigger={refreshTrigger} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            LogFoto - Sistema de Cadastro de Produtos © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;