import api from './api'
import { Produto, ProdutoFormData, ApiList } from '../types'

export const produtoService = {
  /**
   * Listar todos os produtos
   */
  async listar(): Promise<Produto[]> {
    const response = await api.get<ApiList<Produto>>('/api/produtos')
    return response.data
  },

  /**
   * Obter produto por ID
   */
  async obterPorId(id: number): Promise<Produto> {
    const response = await api.get<Produto>(`/api/produtos/${id}`)
    return response.data
  },

  /**
   * Criar novo produto
   */
  async criar(dados: ProdutoFormData): Promise<Produto> {
    const response = await api.post<Produto>('/api/produtos', dados)
    return response.data
  },

  /**
   * Atualizar produto
   */
  async atualizar(id: number, dados: ProdutoFormData): Promise<Produto> {
    const response = await api.put<Produto>(`/api/produtos/${id}`, dados)
    return response.data
  },

  /**
   * Deletar produto
   */
  async deletar(id: number): Promise<void> {
    await api.delete(`/api/produtos/${id}`)
  },
}
