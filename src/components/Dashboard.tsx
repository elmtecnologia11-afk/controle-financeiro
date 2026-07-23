import { useState } from 'react'
import type { Expense } from '../types'
import { formatCurrency, getMonthName, getAvailableMonths, filterByMonth } from '../utils/storage'
import { TrendingUp, Receipt, Building2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

interface DashboardProps {
  expenses: Expense[]
}

export function Dashboard({ expenses }: DashboardProps) {
  const months = getAvailableMonths(expenses)
  const today = new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(months.includes(today) ? today : (months[0] || today))

  const monthExpenses = filterByMonth(expenses, selectedMonth)
  const totalGeral = monthExpenses.reduce((s, e) => s + e.amount, 0)
  const totalDespesas = monthExpenses.filter((e) => e.type === 'despesas').reduce((s, e) => s + e.amount, 0)
  const totalEmpresa = monthExpenses.filter((e) => e.type === 'empresa').reduce((s, e) => s + e.amount, 0)

  const prevMonth = months[months.indexOf(selectedMonth) + 1]
  const prevExpenses = prevMonth ? filterByMonth(expenses, prevMonth) : []
  const totalPrev = prevExpenses.reduce((s, e) => s + e.amount, 0)
  const diff = totalPrev > 0 ? ((totalGeral - totalPrev) / totalPrev) * 100 : 0

  const currentIdx = months.indexOf(selectedMonth)
  const canPrev = currentIdx < months.length - 1
  const canNext = currentIdx > 0

  const goPrev = () => { if (canPrev) setSelectedMonth(months[currentIdx + 1]) }
  const goNext = () => { if (canNext) setSelectedMonth(months[currentIdx - 1]) }

  const cards = [
    { label: 'Total do Mês', value: totalGeral, icon: Calendar, color: '#6366f1' },
    { label: 'Despesas', value: totalDespesas, icon: Receipt, color: '#ef4444' },
    { label: 'Empresa', value: totalEmpresa, icon: Building2, color: '#f59e0b' },
    { label: prevMonth ? `Mês Anterior (${getMonthName(prevMonth).split(' de ')[0]})` : 'Mês Anterior', value: totalPrev, icon: TrendingUp, color: '#22c55e' },
  ]

  return (
    <div className="dashboard">
      <div className="month-selector">
        <button className="month-nav" onClick={goPrev} disabled={!canPrev}>
          <ChevronLeft size={20} />
        </button>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {months.map((m) => (
            <option key={m} value={m}>{getMonthName(m)}</option>
          ))}
        </select>
        <button className="month-nav" onClick={goNext} disabled={!canNext}>
          <ChevronRight size={20} />
        </button>
      </div>
      {diff !== 0 && (
        <p className={`month-diff ${diff >= 0 ? 'up' : 'down'}`}>
          {diff >= 0 ? '▲' : '▼'} {Math.abs(diff).toFixed(1)}% em relação ao mês anterior
        </p>
      )}

      <div className="cards">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="card" style={{ borderTopColor: card.color }}>
              <div className="card-header">
                <Icon size={20} color={card.color} />
                <span>{card.label}</span>
              </div>
              <div className="card-value">{formatCurrency(card.value)}</div>
            </div>
          )
        })}
      </div>

      {monthExpenses.length > 0 && (
        <div className="dashboard-details">
          <div className="detail-section">
            <h3>Por Tipo</h3>
            <div className="detail-bar">
              <div className="bar-item" style={{ flex: totalDespesas || 1 }}>
                <div className="bar-fill despesas-fill" style={{ width: `${totalGeral > 0 ? (totalDespesas / totalGeral) * 100 : 0}%` }} />
                <span>Despesas: {formatCurrency(totalDespesas)}</span>
              </div>
              <div className="bar-item" style={{ flex: totalEmpresa || 1 }}>
                <div className="bar-fill empresa-fill" style={{ width: `${totalGeral > 0 ? (totalEmpresa / totalGeral) * 100 : 0}%` }} />
                <span>Empresa: {formatCurrency(totalEmpresa)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
