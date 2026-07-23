import { useState, useEffect } from 'react'
import type { Expense } from './types'
import { loadExpenses, saveExpenses } from './utils/storage'
import { useFirebase } from './hooks/useFirebase'
import { Header } from './components/Header'
import { Dashboard } from './components/Dashboard'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { Loader2, AlertCircle } from 'lucide-react'
import './App.css'

export default function App() {
  const { user, loading, expenses, addExpense, deleteExpense, signIn, error } = useFirebase()
  const [localExpenses, setLocalExpenses] = useState<Expense[]>(() => loadExpenses())
  const [page, setPage] = useState('dashboard')
  useEffect(() => {
    if (user) {
      const local = loadExpenses()
      local.forEach((e) => {
        addExpense({ ...e, userId: user.uid })
      })
      if (local.length > 0) {
        localStorage.removeItem('controle-financeiro-expenses')
      }
    }
  }, [user])

  const currentExpenses = user ? expenses : localExpenses

  const handleAdd = (data: Omit<Expense, 'id'>) => {
    if (user) {
      addExpense({ ...data, userId: user.uid })
    } else {
      const newExpense: Expense = { ...data, id: crypto.randomUUID() }
      setLocalExpenses((prev) => [newExpense, ...prev])
      saveExpenses([newExpense, ...localExpenses])
    }
    setPage('list')
  }

  const handleDelete = (id: string) => {
    if (user) {
      deleteExpense(id)
    } else {
      setLocalExpenses((prev) => prev.filter((e) => e.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <Loader2 size={32} className="spin" />
        <p>Conectando...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="loading-screen">
        <h2>Controle Financeiro</h2>
        <p>Seus dados salvos na nuvem</p>
        <button className="btn-primary" onClick={signIn} style={{ maxWidth: 300 }}>
          Entrar anonimamente
        </button>
        <button
          className="btn-secondary"
          onClick={() => window.location.reload()}
          style={{ maxWidth: 300, marginTop: 8 }}
        >
          Usar apenas local (sem nuvem)
        </button>
        {error && <p className="error-msg"><AlertCircle size={16} /> {error}</p>}
      </div>
    )
  }

  return (
    <div className="app">
      <Header currentPage={page} onNavigate={setPage} />
      <main className="main">
        {page === 'dashboard' && <Dashboard expenses={currentExpenses} />}
        {page === 'add' && <ExpenseForm onAdd={handleAdd} />}
        {page === 'list' && <ExpenseList expenses={currentExpenses} onDelete={handleDelete} />}
      </main>
    </div>
  )
}
