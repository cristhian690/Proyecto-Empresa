# 📊 Kardex Viewer

Sistema web para el procesamiento automático de inventarios en formato Kardex,
con cálculo de Costo Promedio Ponderado y verificación de integridad de datos.

> 🧪 **v1.0 —En fase de pruebas y corrección de errores.**

---

## 🧱 Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite + TypeScript + Tailwind v4 |
| Backend | FastAPI + Python |
| Base de datos | PostgreSQL |
| ORM | SQLAlchemy + Alembic |
| Procesamiento | pandas + openpyxl |

---

## ✨ Funcionalidades

- 📥 Carga de archivos Excel de movimientos Kardex
- 🧮 Cálculo automático con **Costo Promedio Ponderado**
- 🔍 Verificación de integridad en dos niveles (A y B)
- 🚦 Sistema de semáforo por fila (🟢🟡🔴⚫)
- 📅 Filtros por código, año/mes, fecha exacta y rango
- 📤 Exportación a Excel con estructura original
- 🗄️ Almacenamiento histórico en PostgreSQL
- ⚠️ Detección de saldos negativos y duplicados

---

## 🚀 Instalación

### Requisitos previos

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+

### Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate      # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
```

Configura el archivo `.env`:

```env
DATABASE_URL=postgresql://usuario:password@localhost/kardex_db
CORS_ORIGINS=http://localhost:5173
```

Ejecutar migraciones:

```bash
alembic upgrade head
```

Iniciar servidor:

```bash
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
```

Configura el archivo `.env`:

```env
VITE_API_URL=http://localhost:8000
```

Iniciar servidor de desarrollo:

```bash
npm run dev
```

---

## 🗺️ Estado del desarrollo

### Backend
- [x] config.py y database.py
- [x] models/ — tablas PostgreSQL
- [x] Migraciones con Alembic
- [x] repositories/ — acceso a BD
- [x] services/ — lógica Kardex
- [x] routers/ — endpoints API
- [ ] tests/ — en progreso

### Frontend
- [x] Estructura base con Vite + React + TypeScript
- [x] Tailwind v4 configurado
- [x] types/index.ts
- [x] services/ — cliente API
- [x] hooks/ — useKardex, useFiltros
- [x] lib/utils.ts
- [x] components/ui/ — Button, Badge, Alert
- [x] components/ — todos los componentes
- [x] pages/ — Home, Kardex, Historial

### Testing y correcciones
- [ ] Pruebas de integración frontend ↔ backend
- [ ] Corrección de errores detectados
- [ ] Validación de cálculo Kardex con datos reales
- [ ] Verificación de exportación Excel

---

## 🐛 Problemas conocidos

> Se irán documentando conforme avance el testing.

---

## 🔮 Mejoras futuras

- Autenticación con JWT
- Roles y permisos
- Reportes estadísticos y gráficos
- Soporte PEPS/FIFO
- Auditoría detallada de cambios

---
