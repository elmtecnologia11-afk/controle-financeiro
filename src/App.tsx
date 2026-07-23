import { useState, useEffect } from 'react'
import type { Expense } from './types'
import { loadExpenses, saveExpenses } from './utils/storage'
import { Header } from './components/Header'
import { Dashboard } from './components/Dashboard'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import './App.css'

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses())
  const [page, setPage] = useState('dashboard')

  useEffect(() => {
    saveExpenses(expenses)
  }, [expenses])

  const handleAdd = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev])
    setPage('list')
  }

  const handleDelete = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="app">
      <Header currentPage={page} onNavigate={setPage} />
      <main className="main">
        {page === 'dashboard' && <Dashboard expenses={expenses} />}
        {page === 'add' && <ExpenseForm onAdd={handleAdd} />}
        {page === 'list' && <ExpenseList expenses={expenses} onDelete={handleDelete} />}
      </main>
    </div>
  )
}