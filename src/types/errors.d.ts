export interface ApiError extends Error {
  message: string | string[]
  code: 401 | 404 | 405 | 422 | 500
}
