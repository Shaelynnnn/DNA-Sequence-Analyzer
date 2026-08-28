const DEFAULT_API_BASE_URL = 'http://localhost:8000'

// An environment variable allows deployments to point at another backend
// without changing application source code.
const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, '')

interface ApiErrorBody {
  detail?: unknown
}

/** Error raised for a completed HTTP request with a non-success status. */
export class ApiError extends Error {
  readonly status: number
  readonly detail: unknown

  constructor(status: number, message: string, detail?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === 'object' && value !== null && 'detail' in value
}

async function readErrorBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json().catch(() => undefined)
  }

  const text = await response.text()
  return text || undefined
}

function getErrorMessage(response: Response, body: unknown): string {
  if (isApiErrorBody(body) && typeof body.detail === 'string') {
    return body.detail
  }

  if (typeof body === 'string') {
    return body
  }

  return `API request failed with status ${response.status}`
}

/**
 * Send a request to the backend and deserialize its JSON response.
 * Network errors remain native TypeErrors; HTTP failures become ApiErrors.
 */
// async allows this function to await work and guarantees a Promise return value.
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  if (options.body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  // await pauses this function until fetch resolves with the HTTP response.
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const body = await readErrorBody(response)
    const detail = isApiErrorBody(body) ? body.detail : body
    throw new ApiError(response.status, getErrorMessage(response, body), detail)
  }

  return response.json() as Promise<T>
}
