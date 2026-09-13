"""HTTP endpoints for DNA analysis."""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.analyzer import analyze_dna
from app.schemas import (
    DNAAnalysisRequest,
    DNAAnalysisResponse,
    HealthResponse,
)


app = FastAPI(
    title="DNA Sequence Analyzer API",
    description="Normalize, validate, and analyze DNA sequences.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/api/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    tags=["System"],
    summary="Check whether the API is running",
)
def health_check() -> HealthResponse:
    """Return a simple response showing that the backend is available."""
    return HealthResponse(status="ok")


@app.post(
    "/api/analyze",
    response_model=DNAAnalysisResponse,
    status_code=status.HTTP_200_OK,
    tags=["DNA Analysis"],
    summary="Analyze a DNA sequence",
)
def analyze_sequence(request: DNAAnalysisRequest) -> DNAAnalysisResponse:
    """Analyze the submitted DNA sequence and return all calculated results."""
    try:
        analysis = analyze_dna(request.sequence)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error

    return DNAAnalysisResponse.model_validate(analysis)
