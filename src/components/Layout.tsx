import { Outlet, NavLink, useNavigate } from 'react-router-dom'

function IconDashboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  )
}

function IconLeaf() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  )
}

function IconBuilding() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

function IconDoc() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}

function IconLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  { to: '/residuos', label: 'Resíduos', icon: IconLeaf },
  { to: '/empresas', label: 'Empresas', icon: IconBuilding },
  { to: '/mtrs', label: 'MTRs', icon: IconDoc },
]

export default function Layout() {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-44 flex-shrink-0 bg-[#062630] flex flex-col text-white">
        <div className="px-5 pt-6 pb-5">
          <h1 className="text-lg font-bold leading-tight" style={{ fontFamily: "'Public Sans', sans-serif" }}>
            AmazoTrack
          </h1>
          <p className="text-[10px] tracking-[0.15em] uppercase mt-0.5 text-[#4fa89e] font-medium">
            Gestão Industrial
          </p>
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#005F73] text-white'
                    : 'text-[#8ab8c0] hover:bg-[#0d3545] hover:text-white'
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#8ab8c0] hover:text-white w-full rounded-lg hover:bg-[#0d3545] transition-all duration-150"
          >
            <IconLogout />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-[#f0f5f8]">
        <Outlet />
      </main>
    </div>
  )
}
