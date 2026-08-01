import { useState, useEffect } from 'react'
import type { Expense } from './types'
import { loadExpenses, saveExpenses, loadCategories, saveCategories } from './utils/storage'
import { useFirebase } from './hooks/useFirebase'
import { Header } from './components/Header'
import { Dashboard } from './components/Dashboard'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { CategoryForm } from './components/CategoryForm'
import { LoginPage } from './components/LoginPage'
import { Loader2 } from 'lucide-react'
import './App.css'

export default function App() {
  const { user, loading, expenses, addExpense, deleteExpense, login, signUp, signOut, error } = useFirebase()
  const [localExpenses, setLocalExpenses] = useState<Expense[]>(() => loadExpenses())
  const [categories, setCategories] = useState<string[]>(() => loadCategories())
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

  const handleAddCategory = (category: string) => {
    const updated = [...categories, category]
    setCategories(updated)
    saveCategories(updated)
  }

  const handleDeleteCategory = (category: string) => {
    const updated = categories.filter((c) => c !== category)
    setCategories(updated)
    saveCategories(updated)
  }

  if (!user) {
    return <LoginPage onLogin={login} onSignUp={signUp} onClearError={() => {}} error={error} loading={loading} />
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <Loader2 size={32} className="spin" />
        <p>Carregando dados...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Header currentPage={page} onNavigate={setPage} onSignOut={signOut} />
      <main className="main">
        {page === 'dashboard' && <Dashboard expenses={currentExpenses} />}
        {page === 'add' && <ExpenseForm onAdd={handleAdd} categories={categories} />}
        {page === 'list' && <ExpenseList expenses={currentExpenses} onDelete={handleDelete} />}
        {page === 'categories' && (
          <CategoryForm
            categories={categories}
            onAdd={handleAddCategory}
            onDelete={handleDeleteCategory}
          />
        )}
      </main>
    </div>
  )
}
