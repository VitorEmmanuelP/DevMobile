/**
 * Formatar valor em moeda (Real)
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '-'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formatar data
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR')
}

/**
 * Tratamento de erro amigável
 */
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.message) return error.message
  return 'Ocorreu um erro. Tente novamente.'
}

/**
 * Validar formulário básico
 */
export function validateForm(data: Record<string, any>, requiredFields: string[]): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors[field] = `${field} é obrigatório`
    }
  })

  return { valid: Object.keys(errors).length === 0, errors }
}
