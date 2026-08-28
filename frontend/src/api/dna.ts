import { apiRequest } from './client'
import type {
  DNAAnalysisRequest,
  DNAAnalysisResponse,
  HealthResponse,
} from './types'

/** Check whether the backend API is available. */
export function checkApiHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return apiRequest<HealthResponse>('/api/health', { signal })
}

/** Submit a DNA sequence for normalization, validation, and analysis. */
export function analyzeDnaSequence(
  sequence: string,
  signal?: AbortSignal,
): Promise<DNAAnalysisResponse> {
  const request: DNAAnalysisRequest = { sequence }

  return apiRequest<DNAAnalysisResponse>('/api/analyze', {
    method: 'POST',
    body: JSON.stringify(request),
    signal,
  })
}
