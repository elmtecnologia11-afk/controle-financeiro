import { useState } from 'react'
import type { Expense } from '../types'
import { CATEGORIES } from '../types'
import { PlusCircle, Receipt, Banknote } from 'lucide-react'

interface ExpenseFormProps {
  onAdd: (expense: Expense) => void
}

export function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<string>(CATEGORIES[0])
  const [type, setType] = useState<'empresa' | 'despesas'>('despesas')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim() || !amount) return

    onAdd({
      id: crypto.randomUUID(),
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      type,
      date,
      createdAt: new Date().toISOString(),
    })

    setDescription('')
    setAmount('')
    setCategory('Alimentação')
    setDate(new Date().toISOString().split('T')[0])
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2>Nova Despesa</h2>
      <div className="form-grid">
        <div className="form-field">
          <label>Descrição</label>
          <input
            type="text"
            placeholder="Ex: Supermercado"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label>Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label>Categoria</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Tipo</label>
          <div className="toggle-group">
            <button
              type="button"
              className={`toggle-btn ${type === 'despesas' ? 'active' : ''}`}
              onClick={() => setType('despesas')}
            >
              <Receipt size={16} /> Despesas
            </button>
            <button
              type="button"
              className={`toggle-btn ${type === 'empresa' ? 'active' : ''}`}
              onClick={() => setType('empresa')}
            >
              <Banknote size={16} /> Empresa
            </button>
          </div>
        </div>
        <div className="form-field">
          <label>Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>
      <button type="submit" className="btn-primary">
        <PlusCircle size={18} />
        Adicionar Despesa
      </button>
    </form>
  )
}
