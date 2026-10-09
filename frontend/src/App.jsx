import React from 'react';
import './index.css';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      
      {/* Contenedor Principal (Efecto Glassmorphism) */}
      <div className="glass-panel w-full max-w-6xl flex flex-col md:flex-row overflow-hidden h-[800px]">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r border-[#ffffff10] p-6 flex flex-col" style={{ backgroundColor: 'rgba(20,20,31,0.4)' }}>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(to top right, #0ea5e9, #8b5cf6)' }}>
              <span className="font-bold text-white">D</span>
            </div>
            <h1 className="text-xl font-bold tracking-wider text-white">DRIVE<span style={{ color: '#0ea5e9' }}>MASTER</span></h1>
          </div>
          
          <nav className="flex flex-col gap-2">
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium border transition-all" style={{ backgroundColor: 'rgba(14, 165, 233, 0.2)', color: '#0ea5e9', borderColor: 'rgba(14, 165, 233, 0.3)' }}>
              <span>📅</span> Dashboard
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white transition-all hover:bg-white/5">
              <span>👨‍🏫</span> Instructores
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white transition-all hover:bg-white/5">
              <span>🚗</span> Vehículos
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white transition-all hover:bg-white/5">
              <span>🧑‍🎓</span> Estudiantes
            </button>
          </nav>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 p-8 flex flex-col gap-8 overflow-y-auto">
          
          <header className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-semibold text-white">Reservation Dashboard</h2>
              <p className="text-slate-400 mt-1">Bienvenido, aquí puedes gestionar los cruces de horarios.</p>
            </div>
            <button className="btn-primary">+ Nueva Reserva</button>
          </header>

          {/* Tarjetas de Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: 'Reservas Activas', val: '74', color: '#0ea5e9' },
              { title: 'Instructores Disp.', val: '12', color: '#8b5cf6' },
              { title: 'Vehículos Libres', val: '15', color: '#10b981' },
              { title: 'Clases Hoy', val: '18', color: '#f97316' },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl p-5 relative overflow-hidden group border border-[#ffffff10]" style={{ backgroundColor: '#14141f' }}>
                <div className="absolute bottom-0 left-0 h-1 w-full transition-opacity opacity-70 group-hover:opacity-100" style={{ backgroundColor: stat.color }}></div>
                <p className="text-sm text-slate-400 font-medium mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-white">{stat.val}</h3>
              </div>
            ))}
          </div>

          {/* Calendario Simulado */}
          <div className="flex-1 rounded-xl p-6 relative border border-[#ffffff10]" style={{ backgroundColor: 'rgba(20,20,31,0.3)' }}>
             <h3 className="text-xl font-medium mb-4 text-white">Semana Actual (Conectado a PostgreSQL)</h3>
             <div className="grid grid-cols-5 gap-2 h-full min-h-[300px]">
                {/* Columnas Simuladas de Días */}
                {['Lun 18', 'Mar 19', 'Mié 20', 'Jue 21', 'Vie 22'].map(day => (
                  <div key={day} className="border-l border-[#ffffff05] pl-2">
                    <p className="text-slate-500 text-sm mb-4 text-center">{day}</p>
                  </div>
                ))}
             </div>
             
             {/* Simulación de un bloque de reserva "Flotante" */}
             <div className="absolute rounded-lg p-3 border border-[#0ea5e9]/50 shadow-lg" style={{ backgroundColor: 'rgba(14, 165, 233, 0.15)', top: '150px', left: '100px', width: '200px' }}>
                <div className="flex justify-between items-start">
                  <p className="text-white font-medium text-sm flex items-center gap-2">🚗 Manejo Defensivo</p>
                </div>
                <p className="text-slate-300 text-xs mt-1">🕒 09:00 - 10:30 (Mañana)</p>
                <p className="text-slate-400 text-xs mt-2">Prof. Carlos P. | Toyota Yaris</p>
             </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default App;
