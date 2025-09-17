import { supabase } from '../lib/supabase';
import { Product, ProductGroup } from '../types/Product';

export const saveProductToSupabase = async (
  product: Omit<Product, 'id' | 'dataHoraCadastro'>
): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert({
      sku: product.sku,
      categoria: product.categoria,
      tamanho: product.tamanho,
      cor: product.cor.toUpperCase(),
    })
    .select()
    .single();

  if (error) throw new Error(`Erro ao salvar produto: ${error.message}`);

  return {
    id: data.id,
    sku: data.sku,
    categoria: data.categoria,
    tamanho: data.tamanho,
    cor: data.cor,
    dataHoraCadastro: data.data_hora_cadastro,
  };
};

export const loadProductsFromSupabase = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('data_hora_cadastro', { ascending: false });

  if (error) throw new Error(`Erro ao carregar produtos: ${error.message}`);

  return data.map(item => ({
    id: item.id,
    sku: item.sku,
    categoria: item.categoria,
    tamanho: item.tamanho,
    cor: item.cor,
    dataHoraCadastro: item.data_hora_cadastro,
  }));
};

export const updateProductInSupabase = async (
  id: string,
  product: Partial<Omit<Product, 'id' | 'dataHoraCadastro'>>
): Promise<Product> => {
  const updateData: any = {};
  if (product.sku) updateData.sku = product.sku;
  if (product.categoria) updateData.categoria = product.categoria;
  if (product.tamanho) updateData.tamanho = product.tamanho;
  if (product.cor) updateData.cor = product.cor.toUpperCase();

  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Erro ao atualizar produto: ${error.message}`);

  return {
    id: data.id,
    sku: data.sku,
    categoria: data.categoria,
    tamanho: data.tamanho,
    cor: data.cor,
    dataHoraCadastro: data.data_hora_cadastro,
  };
};

export const deleteProductFromSupabase = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Erro ao excluir produto: ${error.message}`);
};

export const groupProductsBySku = (products: Product[]): ProductGroup[] => {
  const grouped = products.reduce((acc, product) => {
    const key = product.sku;
    if (!acc[key]) {
      acc[key] = {
        sku: product.sku,
        categoria: product.categoria,
        products: [],
        totalVariations: 0,
      };
    }
    acc[key].products.push(product);
    acc[key].totalVariations = acc[key].products.length;
    return acc;
  }, {} as Record<string, ProductGroup>);

  return Object.values(grouped).sort(
    (a, b) =>
      new Date(b.products[0].dataHoraCadastro).getTime() -
      new Date(a.products[0].dataHoraCadastro).getTime()
  );
};

export const filterProductsFromSupabase = async (filters: {
  sku?: string;
  cor?: string;
  tamanho?: string;
  categoria?: string;
  dataInicio?: string;
  dataFim?: string;
}): Promise<Product[]> => {
  let query = supabase
    .from('products')
    .select('*')
    .order('data_hora_cadastro', { ascending: false });

  if (filters.sku) query = query.ilike('sku', `%${filters.sku}%`);
  if (filters.cor) query = query.ilike('cor', `%${filters.cor.toUpperCase()}%`);
  if (filters.categoria) query = query.eq('categoria', filters.categoria);
  if (filters.tamanho) query = query.eq('tamanho', filters.tamanho);
  if (filters.dataInicio) query = query.gte('data_hora_cadastro', `${filters.dataInicio}T00:00:00`);
  if (filters.dataFim) query = query.lte('data_hora_cadastro', `${filters.dataFim}T23:59:59`);

  const { data, error } = await query;
  if (error) throw new Error(`Erro ao filtrar produtos: ${error.message}`);

  return data.map(item => ({
    id: item.id,
    sku: item.sku,
    categoria: item.categoria,
    tamanho: item.tamanho,
    cor: item.cor,
    dataHoraCadastro: item.data_hora_cadastro,
  }));
};
