export interface Pessoa {
  id: number
  nome: string
  idade?: number
}

export interface Produto {
  id: number
  nome: string
  preco: number
  quantidade?: number
}

export interface ApiResponse<T> {
  data: T
  status: number
}

export type ApiList<T> = T[]

// DTOs para formulários
export interface ProdutoFormData {
  nome: string
  preco: number
  quantidade?: number
}

export interface PessoaFormData {
  nome: string
  idade?: number
}
