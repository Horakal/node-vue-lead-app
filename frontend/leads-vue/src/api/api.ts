import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000',
  withCredentials: true,
})

export default apiClient
