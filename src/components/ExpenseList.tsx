import { useState } from 'react'
import type { Expense } from '../types'
import { formatCurrency, formatDate, getMonthName, getAvailableMonths } from '../utils/storage'
import { Trash2, Search } from 'lucide-react'

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const months = getAvailableMonths(expenses)
  const [filterType, setFilterType] = useState<string>('todas')
  const [filterMonth, setFilterMonth] = useState<string>('todos')
  const [search, setSearch] = useState('')

  const filtered = expenses.filter((e) => {
    if (filterType !== 'todas' && e.type !== filterType) return false
    if (filterMonth !== 'todos' && !e.date.startsWith(filterMonth)) return false
    if (search && !e.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="expense-list">
      <h2>Despesas</h2>
      <div className="list-filters">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
          <option value="todos">Todos os meses</option>
          {months.map((m) => (
            <option key={m} value={m}>{getMonthName(m)}</option>
          ))}
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="todas">Todos os tipos</option>
          <option value="despesas">Despesas</option>
          <option value="empresa">Empresa</option>
        </select>
      </div>
      {sorted.length === 0 ? (
        <p className="empty-state">Nenhuma despesa encontrada.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((expense) => (
                <tr key={expense.id}>
                  <td>{formatDate(expense.date)}</td>
                  <td>{expense.description}</td>
                  <td><span className="badge badge-cat">{expense.category}</span></td>
                  <td>
                    <span className={`badge badge-type ${expense.type}`}>
                      {expense.type === 'empresa' ? '👔 Empresa' : '💸 Despesas'}
                    </span>
                  </td>
                  <td className="amount">{formatCurrency(expense.amount)}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(expense.id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
