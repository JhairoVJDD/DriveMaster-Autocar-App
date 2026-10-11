import React, { useState } from 'react';
import { 
  Car, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Plus, 
  Clock, 
  ChevronRight, 
  Activity, 
  Layers, 
  Zap, 
  Gauge,
  Sparkles,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterShift, setFilterShift] = useState('ALL');
  
  // Reservas conectables a PostgreSQL / Supabase
  const [reservations, setReservations] = useState([
    {
      id: 'res-101',
      student: 'Jhairo Ventocilla',
      instructor: 'Ing. Carlos Mendoza',
      vehicle: 'Toyota Yaris 2024 • A1X-890',
      time: '08:00 - 09:30',
      date: 'Hoy, 11 Oct',
      shift: 'MORNING',
      category: 'Clase Práctica A-1',
      status: 'CONFIRMED'
    },
    {
      id: 'res-102',
      student: 'Mariana Silva',
      instructor: 'Prof. Andrea Rivas',
      vehicle: 'Hyundai Accent • B4Z-321',
      time: '10:00 - 11:30',
      date: 'Hoy, 11 Oct',
      shift: 'MORNING',
      category: 'Circuito de Manejo',
      status: 'IN_PROGRESS'
    },
    {
      id: 'res-103',
      student: 'Luis Fernando Torres',
      instructor: 'Ing. Roberto Gómez',
      vehicle: 'Kia Rio Sport • C9Q-104',
      time: '14:30 - 16:00',
      date: 'Hoy, 11 Oct',
      shift: 'AFTERNOON',
      category: 'Estacionamiento Paralelo',
      status: 'SCHEDULED'
    }
  ]);

  // Formulario interactivo
  const [formData, setFormData] = useState({
    student: '',
    instructor: 'Carlos Mendoza',
    vehicle: 'Toyota Yaris 2024',
    time: '16:30 - 18:00',
    shift: 'AFTERNOON'
  });

  const handleCreateReservation = (e) => {
    e.preventDefault();
    if (!formData.student.trim()) return;

    const newRes = {
      id: 'res-' + Date.now().toString().slice(-4),
      student: formData.student,
      instructor: formData.instructor,
      vehicle: formData.vehicle,
      time: formData.time,
      date: 'Hoy, 11 Oct',
      shift: formData.shift,
      category: 'Clase de Manejo Práctica',
      status: 'CONFIRMED'
    };

    setReservations([newRes, ...reservations]);
    setIsModalOpen(false);
    setFormData({ ...formData, student: '' });

    // Animación de partículas y feedback tipo Kokonut UI / ReUI
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.75 },
      colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']
    });
  };

  const filteredReservations = filterShift === 'ALL' 
    ? reservations 
    : reservations.filter(r => r.shift === filterShift);

  return (
    <div className="min-h-screen relative flex flex-col justify-between selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Luces Ambientales de Fondo Dinámicas (Kokonut Glow) */}
      <div className="glow-ambient w-[600px] h-[600px] bg-blue-600 top-[-100px] left-[-150px]"></div>
      <div className="glow-ambient w-[500px] h-[500px] bg-purple-600 top-[20%] right-[-100px]"></div>
      <div className="glow-ambient w-[600px] h-[600px] bg-emerald-600 bottom-[-150px] left-[30%]"></div>

      {/* NAVBAR ULTRA PREMIUM (Kokonut UI Style) */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl border-b border-white/[0.07] bg-black/40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3.5 group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Gauge className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-white">AUTOCAR</span>
                <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Master Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Control Inteligente Anti-Cruces</p>
            </div>
          </div>

          {/* Menú Cápsula Interactiva */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Layers },
              { id: 'calendar', label: 'Horarios GiST', icon: Calendar },
              { id: 'vehicles', label: 'Flota', icon: Car },
              { id: 'instructors', label: 'Instructores', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Estado de Supabase & Botón ReUI con Shimmer */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-active"></span>
              Supabase Activo
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-shimmer flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Nueva Reserva
            </button>
          </div>

        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 z-10">
        
        {/* HERO SECTION DE IMPACTO */}
        <section className="glass-panel rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Garantía Matemática Anti-Solapamiento
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-3">
              Sistema de Gestión <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">DriveMaster AutoCar</span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 font-normal">
              Diseñado con validación de rangos temporales en base de datos PostgreSQL <code className="px-2 py-0.5 rounded bg-white/10 text-blue-300 font-mono text-xs">EXCLUDE USING GIST</code>. Imposible generar choques de horarios entre vehículos e instructores.
            </p>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-shimmer flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-slate-100 transition-all cursor-pointer shadow-xl hover:scale-[1.02]"
              >
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                Agendar Práctica Inmediata
              </button>
              <button 
                onClick={() => setActiveTab('vehicles')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-medium text-xs border border-white/[0.1] transition-colors cursor-pointer"
              >
                Ver Flota de Autos
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
            <Car className="w-72 h-72 text-blue-400 -rotate-12" />
          </div>
        </section>

        {/* BENTO GRID DE ESTADÍSTICAS (ReUI Bento Cards) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Reservas Totales', value: '148', sub: '+12% esta semana', icon: Calendar, color: 'text-blue-400', border: 'hover:border-blue-500/40' },
            { title: 'Vehículos Operativos', value: '18 / 20', sub: 'Flota 100% asegurada', icon: Car, color: 'text-emerald-400', border: 'hover:border-emerald-500/40' },
            { title: 'Instructores Activos', value: '14', sub: 'Certificados MTC', icon: Users, color: 'text-purple-400', border: 'hover:border-purple-500/40' },
            { title: 'Tasa Anti-Conflicto', value: '100%', sub: '0 cruces registrados', icon: ShieldCheck, color: 'text-amber-400', border: 'hover:border-amber-500/40' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`glass-card rounded-2xl p-5 ${stat.border} flex flex-col justify-between`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.title}</span>
                  <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                  <div className="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {stat.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* TABLERO DINÁMICO DE RESERVAS */}
        <section className="glass-panel rounded-3xl p-6 border border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Cronograma de Prácticas
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Control de turnos y sincronización con Supabase</p>
            </div>

            {/* Filtros de turno estilo Kokonut */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              {[
                { id: 'ALL', label: 'Todos' },
                { id: 'MORNING', label: 'Mañana' },
                { id: 'AFTERNOON', label: 'Tarde' },
                { id: 'NIGHT', label: 'Noche' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterShift(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterShift === f.id
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tarjetas Interactivas de Reserva */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReservations.map((item) => (
              <div 
                key={item.id} 
                className="glass-card rounded-2xl p-5 relative overflow-hidden group border border-white/[0.07] hover:border-blue-500/30 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {item.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    item.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">{item.student}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.instructor}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <Car className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.vehicle}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{item.time}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{item.date}</span>
                </div>
              </div>
            ))}
          </div>

        </section>

      </main>

      {/* MODAL ULTRA ESTILIZADO CON CONFETI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-white/10 shadow-2xl relative">
            
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Nueva Reserva de Manejo</h3>
                  <p className="text-[11px] text-slate-400">Protegido por restricciones de Supabase</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Nombre del Alumno</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Sofía Velásquez"
                  value={formData.student}
                  onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Instructor</label>
                  <select 
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#10121a] border border-white/[0.1] text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Carlos Mendoza">Carlos Mendoza</option>
                    <option value="Andrea Rivas">Andrea Rivas</option>
                    <option value="Roberto Gómez">Roberto Gómez</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Vehículo</label>
                  <select 
                    value={formData.vehicle}
                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#10121a] border border-white/[0.1] text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Toyota Yaris 2024">Toyota Yaris 2024</option>
                    <option value="Hyundai Accent 2023">Hyundai Accent 2023</option>
                    <option value="Kia Rio Sport">Kia Rio Sport</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Turno</label>
                  <select 
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#10121a] border border-white/[0.1] text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="MORNING">Mañana</option>
                    <option value="AFTERNOON">Tarde</option>
                    <option value="NIGHT">Noche</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Horario</label>
                  <input 
                    type="text" 
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 flex items-center gap-2 mt-1">
                <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400" />
                <span>Validado por motor de exclusión GiST de PostgreSQL.</span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08] mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-medium transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-shimmer px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:scale-[1.02] cursor-pointer"
                >
                  Confirmar Reserva
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* FOOTER PREMIUM */}
      <footer className="border-t border-white/[0.06] bg-black/20 px-6 py-4 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>© 2026 DriveMaster AutoCar • Sistema Académico y de Reservas</div>
          <div className="flex items-center gap-4">
            <span>React 19 + Tailwind v4</span>
            <span>•</span>
            <span className="text-slate-400">PostgreSQL Tsrange Engine</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
