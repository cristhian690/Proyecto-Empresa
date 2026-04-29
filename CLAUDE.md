# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kardex Viewer is a full-stack web app for processing inventory Kardex Excel files. It calculates Weighted Average Cost (Costo Promedio Ponderado), verifies data integrity, and stores results historically in PostgreSQL.

## Commands

### Backend (run from `backend/`)

```bash
# Activate venv first (Windows)
source venv/Scripts/activate

# Run dev server
uvicorn app.main:app --reload --port 8000

# Run migrations
alembic upgrade head

# Create new migration after model changes
alembic revision --autogenerate -m "description"

# Run tests
pytest
pytest tests/test_specific.py::test_name   # single test
```

### Frontend (run from `frontend/`)

```bash
npm run dev      # dev server at http://localhost:5173
npm run build    # tsc + vite build
npm run lint     # eslint
```

## Environment Setup

**`backend/.env`** (required fields):
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost/kardex_db
SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:5173
DEBUG=true
```

**`frontend/.env`**:
```env
VITE_API_URL=http://localhost:8000
```

## Architecture

### Backend Layer Pattern

```
routers/       ← HTTP layer, validates file extensions, builds FiltroKardex
services/      ← Business logic orchestration (KardexService, ExcelService)
repositories/  ← Async SQLAlchemy queries
models/        ← SQLAlchemy ORM models
schemas/       ← Pydantic v2 request/response models
```

All DB operations are fully async (`asyncpg` driver, `AsyncSession`). The `get_db` dependency in `core/database.py` auto-commits on success and rolls back on exception.

### Kardex Processing Pipeline

The core computation lives in `app/services/kardex_engine.py` (pure pandas, no DB):

1. `parsear_saldos_iniciales()` — reads the initial balances Excel
2. `parsear_movimientos()` — reads movement Excel files, filters invalid rows
3. `detectar_duplicados()` — rejects same product code across multiple files
4. `calcular_saldo_final()` — applies Weighted Average Cost rules per product, sorted by date (purchases before sales on the same day)
5. `verificar_integridad()` — computes the semaphore per row

`KardexService` in `kardex_service.py` calls the engine functions and persists results to DB.

### Semaphore System

The `semaforo` (🟢🟡🔴⚫) is **never stored in the database** — it is calculated at runtime from two boolean flags that ARE stored:
- `error_a`: calculated value differs from the original Excel value
- `error_b`: internal inconsistency within the original Excel (e.g., qty × unit_cost ≠ total)

Both errors → ⚫, only A → 🔴, only B → 🟡, neither → 🟢

### Operation Types

Valid values for `tipo_operacion` (defined in `kardex_engine.py`):
- `"01 Venta"` — EXIT movement; cost per unit stays constant
- `"02 Compra"` — ENTRY; recalculates weighted average cost
- `"05 Devolucion Recibida"` — ENTRY with unit cost = 0; quantity increases but average cost doesn't change

### API Endpoints (`/api/v1`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/kardex/procesar` | Upload 1–3 movement `.xlsx` files + optional initial balances |
| GET | `/kardex/consultar/{id}` | Query stored kardex with filters |
| GET | `/kardex/historial` | Paginated processing history |
| GET | `/kardex/exportar/{id}` | Download processed kardex as Excel |
| GET | `/historial/` | Historial router (alternate) |
| GET | `/saldos/` | Initial balances endpoints |

Interactive API docs available at `http://localhost:8000/docs`.

### Frontend Structure

Three pages with React Router v7:
- `/` → `Home.tsx` — file upload via `FileUploader`, triggers `POST /kardex/procesar`, then navigates to `/kardex/:id`
- `/kardex/:procesamiento_id` → `Kardex.tsx` — displays `KardexTable` with filters (`FiltroCodigo`, `FiltroFecha`) and `Metricas`
- `/historial` → `Historial.tsx` — lists past processings

API calls are centralized in `frontend/src/services/` (axios instance in `api.ts` reads `VITE_API_URL`). State and filter logic live in `hooks/useKardex.ts` and `hooks/useFiltros.ts`.

### Database Schema

Four tables: `productos` → `saldos_iniciales` (one per product), `procesamientos`, `movimientos`. The `movimientos` table stores both calculated values and original Excel values (`orig_*` columns) for audit. A `UniqueConstraint` on `(procesamiento_id, producto_id, serie, numero)` prevents duplicate movement entries.
