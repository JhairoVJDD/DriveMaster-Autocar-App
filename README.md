# 🚗 Driving School Management System (Backend + Frontend)

Sistema integral para la gestión operativa y académica de una **Escuela de Conductores (Autoescuela)**. Diseñado con una arquitectura moderna, segura y de alto rendimiento que previene conflictos de solapamiento de horarios en vehículos e instructores.

---

## 📁 Estructura del Proyecto (Monorepo)

```text
├── backend/                  # API REST con Node.js, Express y Supabase
│   ├── src/
│   │   ├── controllers/      # Controladores (instructores, reservas, alumnos, vehículos)
│   │   ├── middlewares/      # Manejo global de errores, seguridad (Helmet, CORS)
│   │   ├── routers/          # Rutas de la API (/api/reservations, /api/vehicles, etc.)
│   │   ├── utils/            # Conexión Supabase, paginación, utilitarios
│   │   └── index.js          # Punto de entrada de la API
│   ├── database_schema.sql   # Esquema PostgreSQL con restricciones GiST (anti-solapamiento)
│   ├── .env.example          # Plantilla de variables de entorno
│   └── package.json
│
├── frontend/                 # Aplicación Web React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── App.jsx           # Dashboard interactivo con estética moderna y dark mode
│   │   └── index.css         # Estilos Tailwind CSS v4
│   ├── index.html
│   └── package.json
│
├── .gitignore                # Reglas globales de exclusión para Git (seguridad y limpieza)
└── README.md                 # Documentación del proyecto
```

---

## 🛠️ Tecnologías Utilizadas

* **Backend:** Node.js, Express.js, Supabase (PostgreSQL), Joi, Helmet, CORS.
* **Base de Datos:** PostgreSQL con extensiones `btree_gist` y rangos temporales (`tsrange`) para evitar colisiones horarias en reservas.
* **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide Icons.

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone <URL_DE_TU_REPOSITORIO>
cd Backend-CAR
```

### 2. Configurar y Ejecutar el Backend
```bash
cd backend
npm install
```
* Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```
* Configura tus credenciales de Supabase en `.env`:
```env
PORT=4000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key-o-service-key
```
* Iniciar el servidor en modo desarrollo:
```bash
npm run dev
```
La API estará disponible en `http://localhost:4000/api/health`.

### 3. Configurar y Ejecutar el Frontend
En otra terminal:
```bash
cd frontend
npm install
npm run dev
```
La aplicación web se abrirá en `http://localhost:5173/`.

---

## 🔒 Seguridad y Buenas Prácticas
* **Variables protegidas:** Los archivos con credenciales reales (`.env`) están estrictamente ignorados por Git.
* **Sin código pesado:** Las dependencias (`node_modules`) se excluyen del repositorio y se restauran con `npm install`.
