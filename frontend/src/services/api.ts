import axios from 'axios'
import type { ApiError } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 1000000,
})

// ── Interceptor de respuesta ──────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      message:
        error.response?.data?.detail ||
        error.message ||
        'Error de conexión con el servidor',
      status: error.response?.status || 500,
    }

    return Promise.reject(apiError)
  }
)

export default api