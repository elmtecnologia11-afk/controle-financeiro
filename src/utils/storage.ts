import type { Expense } from '../types'
import { DEFAULT_CATEGORIES } from '../types'

const CATEGORY_STORAGE_KEY = 'controle-financeiro-categories'

export function loadCategories(): string[] {
  try {
    const data = localStorage.getItem(CATEGORY_STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
    return [...DEFAULT_CATEGORIES]
  } catch {
    return [...DEFAULT_CATEGORIES]
  }
}

export function saveCategories(categories: string[]): void {
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories))
}

const STORAGE_KEY = 'controle-financeiro-expenses'

export function loadExpenses(): Expense[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR')
}

export function getMonthName(ym: string): string {
  const [y, m] = ym.split('-')
  const date = new Date(Number(y), Number(m) - 1)
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

export function getAvailableMonths(expenses: Expense[]): string[] {
  const months = new Set(expenses.map((e) => e.date.slice(0, 7)))
  return Array.from(months).sort().reverse()
}

export function filterByMonth(expenses: Expense[], month: string): Expense[] {
  return expenses.filter((e) => e.date.startsWith(month))
}
