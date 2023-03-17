export const BASE_URI = import.meta.env.PROD
  ? 'https://sim-api.danascheider.com'
  : import.meta.env.MODE === 'test'
  ? 'http://localhost:3000'
  : '/api'

const contentTypeHeader = { 'Content-Type': 'application/json' }
const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` })
export const combinedHeaders = (token: string) => ({
  ...contentTypeHeader,
  ...authHeader(token),
})
