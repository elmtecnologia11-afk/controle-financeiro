export type ExpenseType = 'empresa' | 'despesas'

export interface Expense {
  id: string
  description: string
  amount: number
  category: string
  type: ExpenseType
  date: string
  createdAt: string
  userId?: string
}

export const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Salário',
  'Impostos',
  'Fornecedores',
  'Marketing',
  'Utilidades',
  'Outros',
] as const

export const EXPENSE_TYPES: { value: ExpenseType; label: string }[] = [
  { value: 'empresa', label: 'Empresa' },
  { value: 'despesas', label: 'Despesas' },
]
