import { useState } from 'react'
import { Tag, PlusCircle, Trash2 } from 'lucide-react'

interface CategoryFormProps {
  categories: string[]
  onAdd: (category: string) => void
  onDelete: (category: string) => void
}

export function CategoryForm({ categories, onAdd, onDelete }: CategoryFormProps) {
  const [newCategory, setNewCategory] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.trim()) return
    if (categories.includes(newCategory.trim())) {
      alert('Esta categoria já existe!')
      return
    }
    onAdd(newCategory.trim())
    setNewCategory('')
  }

  return (
    <div className="category-page">
      <form className="expense-form" onSubmit={handleSubmit}>
        <h2>Cadastrar Categoria</h2>
        <div className="form-grid">
          <div className="form-field">
            <label>Nome da Categoria</label>
            <input
              type="text"
              placeholder="Ex: Transporte"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn-primary">
          <PlusCircle size={18} />
          Adicionar Categoria
        </button>
      </form>

      <div className="category-list">
        <h2>Categorias Cadastradas</h2>
        {categories.length === 0 ? (
          <p className="empty-message">Nenhuma categoria cadastrada.</p>
        ) : (
          <div className="category-grid">
            {categories.map((cat) => (
              <div key={cat} className="category-item">
                <Tag size={16} />
                <span>{cat}</span>
                <button
                  className="btn-delete-small"
                  onClick={() => onDelete(cat)}
                  title="Excluir categoria"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
