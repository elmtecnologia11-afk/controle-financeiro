import { Banknote, PieChart, PlusCircle, List, LogOut } from 'lucide-react'

interface HeaderProps {
  currentPage: string
  onNavigate: (page: string) => void
  onSignOut: () => void
}

export function Header({ currentPage, onNavigate, onSignOut }: HeaderProps) {
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
        <button className="nav-btn logout-btn" onClick={onSignOut} title="Sair">
          <LogOut size={18} />
        </button>
      </nav>
    </header>
  )
}
