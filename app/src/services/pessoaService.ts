import api from './api'
import { Pessoa, PessoaFormData, ApiList } from '../types'

export const pessoaService = {
  /**
   * Listar todas as pessoas
   */
  async listar(): Promise<Pessoa[]> {
    const response = await api.get<ApiList<Pessoa>>('/api/pessoas')
    return response.data
  },

  /**
   * Obter pessoa por ID
   */
  async obterPorId(id: number): Promise<Pessoa> {
    const response = await api.get<Pessoa>(`/api/pessoas/${id}`)
    return response.data
  },

  /**
   * Criar nova pessoa
   */
  async criar(dados: PessoaFormData): Promise<Pessoa> {
    const response = await api.post<Pessoa>('/api/pessoas', dados)
    return response.data
  },

  /**
   * Atualizar pessoa
   */
  async atualizar(id: number, dados: PessoaFormData): Promise<Pessoa> {
    const response = await api.put<Pessoa>(`/api/pessoas/${id}`, dados)
    return response.data
  },

  /**
   * Deletar pessoa
   */
  async deletar(id: number): Promise<void> {
    await api.delete(`/api/pessoas/${id}`)
  },
}
