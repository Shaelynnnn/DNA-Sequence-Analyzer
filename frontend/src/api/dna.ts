import { apiRequest } from './client'
import type {
  DNAAnalysisRequest,
  DNAAnalysisResponse,
  HealthResponse,
} from './types'

export function checkApiHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return apiRequest<HealthResponse>('/api/health', { signal })
}

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
