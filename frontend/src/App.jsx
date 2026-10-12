import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Plus, 
  Clock, 
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Award,
  UserPlus,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [filterShift, setFilterShift] = useState('ALL');

  // Datos reales obtenidos desde Supabase / API Express
  const [reservations, setReservations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);

  // Formulario de nueva reserva
  const [formData, setFormData] = useState({
    studentId: '',
    instructorId: '',
    vehicleId: '',
    date: new Date().toISOString().split('T')[0],
    startTimeHour: '10:00',
    endTimeHour: '11:30',
    shift: 'MORNING'
  });

  // Formulario nuevo alumno
  const [studentForm, setStudentForm] = useState({
    first_name: '',
    last_name: '',
    document_id: '',
    email: '',
    phone: ''
  });

  // Formulario nuevo auto
  const [vehicleForm, setVehicleForm] = useState({
    brand: '',
    model: '',
    plate_number: '',
    transmission_type: 'MANUAL'
  });

  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
    setTimeout(() => setAlertMessage(null), 5000);
  };

  // Cargar todos los datos desde el Backend
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [vehRes, instRes, studRes, resRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/instructors'),
        fetch('/api/students'),
        fetch('/api/reservations')
      ]);

      if (vehRes.ok) {
        const v = await vehRes.json();
        setVehicles(v.data || []);
      }
      if (instRes.ok) {
        const i = await instRes.json();
        setInstructors(i.data || []);
      }
      if (studRes.ok) {
        const s = await studRes.json();
        setStudents(s.data || []);
      }
      if (resRes.ok) {
        const r = await resRes.json();
        setReservations(r.data || []);
      }
    } catch (err) {
      console.error('Error al sincronizar con la API:', err);
      showAlert('error', 'No se pudo conectar con el servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Crear Reserva conectada al PostgreSQL GiST
  const handleCreateReservation = async (e) => {
    e.preventDefault();

    if (!formData.studentId || !formData.instructorId || !formData.vehicleId) {
      showAlert('error', 'Selecciona el alumno, instructor y auto.');
      return;
    }

    try {
      const startTime = new Date(`${formData.date}T${formData.startTimeHour}:00`).toISOString();
      const endTime = new Date(`${formData.date}T${formData.endTimeHour}:00`).toISOString();

      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: formData.studentId,
          instructorId: formData.instructorId,
          vehicleId: formData.vehicleId,
          startTime,
          endTime,
          shift: formData.shift
        })
      });

      const result = await res.json();

      if (!res.ok) {
        const msg = result.errors ? result.errors.join(', ') : (result.message || 'Error al agendar reserva');
        showAlert('error', msg);
        return;
      }

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      showAlert('success', '¡Reserva confirmada y verificada contra cruces en Supabase!');
      setIsModalOpen(false);
      loadAllData();
    } catch (err) {
      showAlert('error', 'Error al comunicar con la API de reservas.');
    }
  };

  // Crear Estudiante
  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentForm)
      });
      const data = await res.json();
      if (!res.ok) {
        showAlert('error', data.message || 'Error al matricular alumno');
        return;
      }
      showAlert('success', `Estudiante ${studentForm.first_name} matriculado con éxito`);
      setIsStudentModalOpen(false);
      setStudentForm({ first_name: '', last_name: '', document_id: '', email: '', phone: '' });
      loadAllData();
    } catch (err) {
      showAlert('error', 'Fallo al guardar estudiante');
    }
  };

  // Crear Vehículo
  const handleCreateVehicle = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleForm)
      });
      const data = await res.json();
      if (!res.ok) {
        showAlert('error', data.message || 'Error al registrar vehículo');
        return;
      }
      showAlert('success', `Vehículo ${vehicleForm.plate_number} registrado en flota`);
      setIsVehicleModalOpen(false);
      setVehicleForm({ brand: '', model: '', plate_number: '', transmission_type: 'MANUAL' });
      loadAllData();
    } catch (err) {
      showAlert('error', 'Fallo al registrar vehículo');
    }
  };

  const filteredReservations = filterShift === 'ALL'
    ? reservations
    : reservations.filter(r => r.shift === filterShift);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">

      {/* NOTIFICACIONES TOAST */}
      {alertMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 ${
          alertMessage.type === 'success' 
            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
        }`}>
          {alertMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-semibold">{alertMessage.message}</span>
        </div>
      )}

      {/* HEADER SUPERIOR */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#07090e]/80 border-b border-white/[0.06] px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative w-10 h-10 rounded-2xl bg-[#0d111a] border border-white/10 flex items-center justify-center text-blue-400">
                <Car className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white">DriveMaster</h1>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  AUTO-CAR
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Gestión de Clases & Flota • Supabase PostgreSQL</p>
            </div>
          </div>

          {/* Selector de Pestañas */}
          <div className="hidden md:flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-2xl border border-white/[0.06]">
            {[
              { id: 'dashboard', label: 'Reservas', icon: Calendar, count: reservations.length },
              { id: 'vehicles', label: 'Flota', icon: Car, count: vehicles.length },
              { id: 'students', label: 'Alumnos', icon: Users, count: students.length },
              { id: 'instructors', label: 'Instructores', icon: Award, count: instructors.length }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-white/10 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Botones de Cabecera */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={loadAllData}
              title="Sincronizar datos"
              className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>

            <button
              onClick={() => {
                if (students.length > 0 && instructors.length > 0 && vehicles.length > 0) {
                  setFormData(prev => ({
                    ...prev,
                    studentId: students[0].id,
                    instructorId: instructors[0].id,
                    vehicleId: vehicles[0].id
                  }));
                }
                setIsModalOpen(true);
              }}
              className="btn-shimmer flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Reserva</span>
            </button>
          </div>

        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">

        {/* METRICS CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-3xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">Total Reservas</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{reservations.length}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Garantizadas por GiST</span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-3xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">Flota de Vehículos</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Car className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{vehicles.length}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>100% Operativos</span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-3xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">Alumnos Inscritos</span>
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{students.length}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-violet-400 mt-2 font-medium">
              <span>Categoría A-1 & A-2</span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-3xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">Seguridad & API</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>AES-256 / Helmet</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              <span>Rate Limit & Anti-HPP activos</span>
            </div>
          </div>
        </section>

        {/* TAB 1: RESERVAS */}
        {activeTab === 'dashboard' && (
          <section className="glass-panel rounded-3xl p-6 border border-white/[0.08] flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Programación de Clases Prácticas</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Live Supabase
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Control de horarios sin cruces mediante rangos tsrange de PostgreSQL</p>
              </div>

              {/* Filtro por turno */}
              <div className="flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06] text-xs">
                {['ALL', 'MORNING', 'AFTERNOON', 'NIGHT'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterShift(s)}
                    className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                      filterShift === s 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s === 'ALL' ? 'Todos' : s === 'MORNING' ? 'Mañana' : s === 'AFTERNOON' ? 'Tarde' : 'Noche'}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                <span>Sincronizando con Supabase...</span>
              </div>
            ) : filteredReservations.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No hay reservas para este turno. Haz clic en "Nueva Reserva" para crear una.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReservations.map((item) => (
                  <div 
                    key={item.id} 
                    className="glass-card rounded-2xl p-4 border border-white/[0.06] hover:border-blue-500/40 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                        Turno: {item.shift}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.status || 'CONFIRMED'}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                        {item.students ? `${item.students.first_name} ${item.students.last_name}` : 'Alumno'}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5">
                        <Award className="w-3.5 h-3.5 text-slate-500" />
                        <span>Instructor: {item.instructors ? `${item.instructors.first_name} ${item.instructors.last_name}` : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                        <Car className="w-3.5 h-3.5 text-slate-500" />
                        <span>Vehículo: {item.vehicles ? `${item.vehicles.brand} ${item.vehicles.model} (${item.vehicles.plate_number})` : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span className="truncate max-w-[180px] text-[11px]">{item.reservation_time}</span>
                      </div>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="Validado en Base de Datos" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: FLOTA DE VEHÍCULOS */}
        {activeTab === 'vehicles' && (
          <section className="glass-panel rounded-3xl p-6 border border-white/[0.08] flex flex-col gap-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Car className="w-4 h-4 text-indigo-400" />
                  <span>Flota de Vehículos para Instrucción</span>
                </h2>
                <p className="text-xs text-slate-400">Autos registrados en Supabase con placa única</p>
              </div>
              <button
                onClick={() => setIsVehicleModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Vehículo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vehicles.map(v => (
                <div key={v.id} className="glass-card p-4 rounded-2xl border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">{v.brand} {v.model}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {v.plate_number}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center justify-between mt-3">
                    <span>Transmisión: {v.transmission_type}</span>
                    <span className="text-emerald-400 font-semibold text-[11px]">{v.status || 'AVAILABLE'}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: ESTUDIANTES */}
        {activeTab === 'students' && (
          <section className="glass-panel rounded-3xl p-6 border border-white/[0.08] flex flex-col gap-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-violet-400" />
                  <span>Directorio de Estudiantes</span>
                </h2>
                <p className="text-xs text-slate-400">Alumnos inscritos en el sistema de manejo</p>
              </div>
              <button
                onClick={() => setIsStudentModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Nuevo Alumno</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map(s => (
                <div key={s.id} className="glass-card p-4 rounded-2xl border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{s.first_name} {s.last_name}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-white/[0.05] px-1.5 py-0.5 rounded">
                      DNI: {s.document_id}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 flex flex-col gap-1">
                    <span>Email: {s.email}</span>
                    <span>Tel: {s.phone || 'No registrado'}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 4: INSTRUCTORES */}
        {activeTab === 'instructors' && (
          <section className="glass-panel rounded-3xl p-6 border border-white/[0.08] flex flex-col gap-5">
            <div className="pb-4 border-b border-white/[0.06]">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-400" />
                <span>Cuerpo de Instructores Certificados</span>
              </h2>
              <p className="text-xs text-slate-400">Personal calificado para impartir clases prácticas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {instructors.map(i => (
                <div key={i.id} className="glass-card p-4 rounded-2xl border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{i.first_name} {i.last_name}</span>
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                      Lic: {i.license_number}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2">
                    <span>Teléfono: {i.phone || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* MODAL NUEVA RESERVA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-white/10 shadow-2xl relative">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Programar Clase Práctica</h3>
                  <p className="text-[11px] text-slate-400">PostgreSQL GiST verifica el horario en tiempo real</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Alumno</label>
                <select 
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#10121a] border border-white/[0.1] text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">-- Seleccionar Alumno --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.first_name} {s.last_name} (DNI: {s.document_id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Instructor</label>
                  <select 
                    value={formData.instructorId}
                    onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#10121a] border border-white/[0.1] text-slate-200 focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">-- Seleccionar --</option>
                    {instructors.map(i => (
                      <option key={i.id} value={i.id}>{i.first_name} {i.last_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Vehículo</label>
                  <select 
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#10121a] border border-white/[0.1] text-slate-200 focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">-- Seleccionar --</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plate_number})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Fecha de la Clase</label>
                <input 
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10121a] border border-white/[0.1] text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Inicio</label>
                  <input 
                    type="time"
                    value={formData.startTimeHour}
                    onChange={(e) => setFormData({ ...formData, startTimeHour: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#10121a] border border-white/[0.1] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Fin</label>
                  <input 
                    type="time"
                    value={formData.endTimeHour}
                    onChange={(e) => setFormData({ ...formData, endTimeHour: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#10121a] border border-white/[0.1] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Turno</label>
                  <select 
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl bg-[#10121a] border border-white/[0.1] text-white"
                  >
                    <option value="MORNING">Mañana</option>
                    <option value="AFTERNOON">Tarde</option>
                    <option value="NIGHT">Noche</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 flex items-center gap-2 mt-1">
                <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400" />
                <span>Si el auto ya está reservado en ese intervalo, PostgreSQL bloqueará el choque.</span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08] mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-medium cursor-pointer"
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

      {/* MODAL NUEVO ESTUDIANTE */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-white/10 shadow-2xl relative">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-violet-400" />
                <span>Matricular Nuevo Alumno</span>
              </h3>
              <button onClick={() => setIsStudentModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateStudent} className="flex flex-col gap-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Nombre" 
                  required
                  value={studentForm.first_name} 
                  onChange={e => setStudentForm({ ...studentForm, first_name: e.target.value })} 
                  className="px-3 py-2 rounded-xl bg-[#10121a] border border-white/10 text-white" 
                />
                <input 
                  type="text" 
                  placeholder="Apellido" 
                  required
                  value={studentForm.last_name} 
                  onChange={e => setStudentForm({ ...studentForm, last_name: e.target.value })} 
                  className="px-3 py-2 rounded-xl bg-[#10121a] border border-white/10 text-white" 
                />
              </div>
              <input 
                type="text" 
                placeholder="DNI / Documento" 
                required
                value={studentForm.document_id} 
                onChange={e => setStudentForm({ ...studentForm, document_id: e.target.value })} 
                className="px-3 py-2 rounded-xl bg-[#10121a] border border-white/10 text-white" 
              />
              <input 
                type="email" 
                placeholder="Correo Electrónico" 
                required
                value={studentForm.email} 
                onChange={e => setStudentForm({ ...studentForm, email: e.target.value })} 
                className="px-3 py-2 rounded-xl bg-[#10121a] border border-white/10 text-white" 
              />
              <input 
                type="tel" 
                placeholder="Teléfono" 
                value={studentForm.phone} 
                onChange={e => setStudentForm({ ...studentForm, phone: e.target.value })} 
                className="px-3 py-2 rounded-xl bg-[#10121a] border border-white/10 text-white" 
              />
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsStudentModalOpen(false)} className="px-3 py-1.5 text-slate-400">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-violet-600 text-white font-semibold">Guardar Alumno</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NUEVO VEHÍCULO */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-white/10 shadow-2xl relative">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-indigo-400" />
                <span>Registrar Vehículo en Flota</span>
              </h3>
              <button onClick={() => setIsVehicleModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateVehicle} className="flex flex-col gap-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Marca (ej. Toyota)" 
                  required
                  value={vehicleForm.brand} 
                  onChange={e => setVehicleForm({ ...vehicleForm, brand: e.target.value })} 
                  className="px-3 py-2 rounded-xl bg-[#10121a] border border-white/10 text-white" 
                />
                <input 
                  type="text" 
                  placeholder="Modelo (ej. Yaris)" 
                  required
                  value={vehicleForm.model} 
                  onChange={e => setVehicleForm({ ...vehicleForm, model: e.target.value })} 
                  className="px-3 py-2 rounded-xl bg-[#10121a] border border-white/10 text-white" 
                />
              </div>
              <input 
                type="text" 
                placeholder="Número de Placa (ej. ABC-123)" 
                required
                value={vehicleForm.plate_number} 
                onChange={e => setVehicleForm({ ...vehicleForm, plate_number: e.target.value })} 
                className="px-3 py-2 rounded-xl bg-[#10121a] border border-white/10 text-white" 
              />
              <select 
                value={vehicleForm.transmission_type} 
                onChange={e => setVehicleForm({ ...vehicleForm, transmission_type: e.target.value })} 
                className="px-3 py-2 rounded-xl bg-[#10121a] border border-white/10 text-white"
              >
                <option value="MANUAL">Transmisión Mecánica / Manual</option>
                <option value="AUTOMATIC">Transmisión Automática</option>
              </select>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsVehicleModalOpen(false)} className="px-3 py-1.5 text-slate-400">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold">Guardar Vehículo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
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
