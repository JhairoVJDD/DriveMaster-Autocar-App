# 🚗 DriveMaster AutoCar — Sistema de Gestión para Escuela de Conductores

<div align="center">

**Plataforma integral de gestión académica y operativa para Autoescuelas**  
*Prevención matemática de solapamiento de horarios con PostgreSQL `EXCLUDE USING GIST`*

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Seguridad](https://img.shields.io/badge/Auditoría-0_Vulnerabilidades-brightgreen?logo=shield&logoColor=white)](https://github.com)
[![Licencia](https://img.shields.io/badge/Licencia-ISC-blue.svg)](LICENSE)

</div>

---

## 📁 Estructura del Proyecto (Monorepo)

```text
DriveMaster-Autocar-App/
│
├── backend/                         # API REST (Node.js + Express + Supabase)
│   ├── src/
│   │   ├── controllers/             # Controladores (CRUD de entidades)
│   │   │   ├── instructorController.js
│   │   │   ├── reservationController.js
│   │   │   ├── studentController.js
│   │   │   └── vehicleController.js
│   │   ├── middlewares/             # Manejadores de errores y seguridad
│   │   │   └── errorHandler.js
│   │   ├── routers/                 # Rutas de la API (/api/reservations, /api/vehicles, etc.)
│   │   ├── services/                # Lógica de dominio (reservas anti-cruce)
│   │   │   └── reservationService.js
│   │   ├── utils/
│   │   │   ├── pagination.js        # Utilidad de paginación
│   │   │   ├── security.js          # 🔐 AES-256-GCM + bcrypt (cifrado y hashing)
│   │   │   └── supabase.js          # Cliente de conexión Supabase
│   │   ├── validators/              # Validación de esquemas con Joi
│   │   ├── scripts/                 # Semilla de datos de prueba
│   │   └── index.js                 # 🛡️ Servidor blindado (Helmet, CORS, Rate Limit, HPP)
│   │
│   ├── database_schema.sql          # Esquema SQL con restricciones GiST
│   ├── .env.example                 # Plantilla de variables (SIN secretos)
│   └── package.json
│
├── frontend/                        # Dashboard Web (React 19 + Vite + Tailwind v4)
│   ├── src/
│   │   ├── App.jsx                  # UI interactiva Kokonut UI / ReUI con glassmorphism
│   │   └── index.css                # Estilos Tailwind CSS v4 (@import "tailwindcss")
│   ├── index.html
│   └── package.json
│
├── .gitignore                       # Exclusión estricta de secretos (.env, node_modules)
└── README.md                        # Documentación completa del sistema
```

---

## 🛡️ Arquitectura y Medidas de Seguridad

El sistema implementa una defensa en profundidad que cubre desde la base de datos hasta las cabeceras HTTP:

| Capa | Mecanismo | Descripción |
|---|---|---|
| **Cabeceras HTTP** | `helmet` | HSTS, Content-Security-Policy (CSP), X-Frame-Options (anti-clickjacking), X-Content-Type-Options (anti-sniffing), desactiva `x-powered-by` |
| **Mitigación DDoS / Brute Force** | `express-rate-limit` | Ventana de 15 min con máximo de 200 peticiones por IP |
| **Control de Acceso** | `cors` estricto | Restringido exclusivamente al frontend autorizado (`localhost:5173`) |
| **Anti-Manipulación** | `hpp` | Bloqueo de contaminación de parámetros HTTP (HTTP Parameter Pollution) |
| **Cifrado de Datos Sensibles** | `crypto` (AES-256-GCM) | Cifrado simétrico autenticado para DNI, teléfonos y datos personales |
| **Hashing de Contraseñas** | `bcryptjs` (12 salt rounds) | Hashing criptográfico irreversible resistente a timing attacks |
| **Integridad Transaccional** | PostgreSQL `tsrange` + GiST | Exclusión matemática a nivel de base de datos (`EXCLUDE USING GIST`) para prevenir doble reserva |
| **Protección de Credenciales** | `.gitignore` + `.env.example` | Repositorio 100% libre de credenciales; API keys nunca expuestas |
| **Auditoría de Dependencias** | `pnpm audit --prod` | 0 vulnerabilidades conocidas en dependencias de producción |

---

### Módulo de Seguridad (`backend/src/utils/security.js`)

```javascript
const { encrypt, decrypt, hashPassword, verifyPassword } = require('./utils/security');

// 1. Cifrado simétrico AES-256-GCM (DNI, Teléfono, etc.)
const dniEncriptado = encrypt('74892019');
// Genera: "iv:authTag:ciphertext"

const dniOriginal = decrypt(dniEncriptado);
// Retorna: "74892019"

// 2. Hash irreversible de contraseñas (12 Salt Rounds)
const hash = await hashPassword('ContraseñaSuperSegura2026!');

// 3. Verificación resistente a ataques de temporización
const esValida = await verifyPassword('ContraseñaSuperSegura2026!', hash); // true
```

---

## 🎨 Frontend Moderno (Kokonut UI & ReUI)

El frontend está desarrollado con:
- **React 19** y **Vite 8** para renderizado ultra rápido.
- **Tailwind CSS v4** con configuración `@import "tailwindcss";` nativa.
- Estética inspirada en **Kokonut UI** y **ReUI Animated Buttons**:
  - Efectos de *glassmorphism* y gradientes sutiles.
  - Micro-animaciones en botones interactivos.
  - Notificaciones interactivas con confeti (`canvas-confetti`).
  - Dark mode nativo con paleta Slate/Emerald/Indigo.

---

## 🚀 Instalación y Puesta en Marcha

### Requisitos
- Node.js v20 o superior
- Gestor de paquetes: `pnpm` o `npm`
- Proyecto en [Supabase](https://supabase.com)

### 1. Clonar el repositorio
```bash
git clone https://github.com/JhairoVJDD/DriveMaster-Autocar-App.git
cd DriveMaster-Autocar-App
```

### 2. Configurar y Arrancar el Backend
```bash
cd backend
pnpm install

# Copiar plantilla de variables de entorno
cp .env.example .env
```

Configura tu archivo local `backend/.env` con tus credenciales:
```env
PORT=4000
NODE_ENV=development
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key-de-supabase
ENCRYPTION_SECRET=tu-clave-secreta-de-32-caracteres
FRONTEND_URL=http://localhost:5173
```

Inicia la API:
```bash
pnpm run dev
# Servidor activo en: http://localhost:4000/api/health
```

### 3. Configurar y Arrancar el Frontend
```bash
cd ../frontend
pnpm install
pnpm run dev
# Dashboard disponible en: http://localhost:5173
```

---

## 📡 Endpoints de la API

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/health` | Estado del servidor y módulos de seguridad activos |
| `GET` | `/api/vehicles` | Listado paginado de la flota de vehículos |
| `POST` | `/api/vehicles` | Registro de nuevo vehículo |
| `GET` | `/api/instructors` | Listado de instructores certificados |
| `POST` | `/api/instructors` | Registro de instructor |
| `GET` | `/api/students` | Listado de alumnos registrados |
| `POST` | `/api/students` | Matrícula de nuevo alumno |
| `GET` | `/api/reservations` | Consultar reservas programadas |
| `POST` | `/api/reservations` | Crear reserva (con validación GiST anti-solapamiento) |

---

## 🔒 Buenas Prácticas para Desarrolladores

> ⚠️ **NUNCA** hagas commit de archivos `.env` con credenciales reales.  
> ⚠️ **NUNCA** expongas la `SUPABASE_KEY` ni `ENCRYPTION_SECRET` en foros ni repositorios públicos.  
> ✅ Mantén actualizado el archivo `.env.example` solo con placeholders.  
> ✅ Ejecuta periódicamente `pnpm audit --prod` para asegurar cero vulnerabilidades.

---

## 👨‍💻 Autor

**Jhairo Ventocilla Juan de Dios**  
Ingeniería de Sistemas — Universidad César Vallejo

---

<div align="center">
  <sub>Desarrollado con dedicación para DriveMaster AutoCar © 2026</sub>
</div>
