export interface ApiError extends Error {
  errors: string | string[]
  code: 401 | 404 | 405 | 422 | 500
}
