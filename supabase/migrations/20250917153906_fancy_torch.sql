/*
  # Criar tabela de produtos para o sistema LogFoto

  1. Nova Tabela
    - `products`
      - `id` (uuid, chave primária)
      - `sku` (text, obrigatório)
      - `categoria` (text, obrigatório)
      - `tamanho` (text, obrigatório)
      - `cor` (text, obrigatório, sempre em CAIXA ALTA)
      - `data_hora_cadastro` (timestamptz, data/hora automática)
      - `created_at` (timestamptz, controle interno)
      - `updated_at` (timestamptz, controle interno)

  2. Segurança
    - Habilitar RLS na tabela `products`
    - Adicionar política para permitir todas as operações (sistema público)

  3. Índices
    - Índice para pesquisa por SKU
    - Índice para pesquisa por categoria
    - Índice para pesquisa por cor
    - Índice para pesquisa por data de cadastro
*/

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text NOT NULL,
  categoria text NOT NULL,
  tamanho text NOT NULL,
  cor text NOT NULL,
  data_hora_cadastro timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas as operações (sistema público)
CREATE POLICY "Permitir todas as operações em products"
  ON products
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Criar índices para melhorar performance das consultas
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_categoria ON products(categoria);
CREATE INDEX IF NOT EXISTS idx_products_cor ON products(cor);
CREATE INDEX IF NOT EXISTS idx_products_data_cadastro ON products(data_hora_cadastro);
CREATE INDEX IF NOT EXISTS idx_products_tamanho ON products(tamanho);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();