import { Banknote, PieChart, PlusCircle, List } from 'lucide-react'

interface HeaderProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'add', label: 'Nova Despesa', icon: PlusCircle },
    { id: 'list', label: 'Despesas', icon: List },
  ]

  return (
    <header className="header">
      <div className="header-brand">
        <Banknote size={28} />
        <h1>Controle Financeiro</h1>
      </div>
      <nav className="header-nav">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              className={`nav-btn ${currentPage === tab.id ? 'active' : ''}`}
              onClick={() => onNavigate(tab.id)}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
