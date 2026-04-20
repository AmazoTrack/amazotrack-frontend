import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col p-4 gap-4">
        <h1 className="text-xl font-bold">AmazoTrack</h1>
        <nav className="flex flex-col gap-2">
          <span className="text-blue-300 text-sm">Menu em breve...</span>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}