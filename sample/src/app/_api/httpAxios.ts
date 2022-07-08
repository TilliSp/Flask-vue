import axios, { AxiosInstance } from 'axios'

export const baseURL =
  process.env['NODE_ENV'] === 'production'
    ? 'http://localhost:5000/'
    : 'http://localhost:5000/'

export const socketPath = '/api/socket.io'

export const http: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true
})
