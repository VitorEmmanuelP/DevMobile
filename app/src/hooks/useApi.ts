import { useState, useCallback, useEffect } from 'react'
import api from '../services/api'

interface UseApiResponse<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook customizado para requisições GET
 */
export function useApi<T>(url: string): UseApiResponse<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get<T>(url)
      setData(response.data)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados')
      console.error(`Erro ao carregar ${url}:`, err)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

/**
 * Hook customizado para listar itens com refresh automático
 */
export function useList<T>(url: string) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get<T[]>(url)
      setItems(response.data)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar lista')
      console.error(`Erro ao carregar ${url}:`, err)
    } finally {
      setLoading(false)
    }
  }, [url])

  return { items, loading, error, load }
}
