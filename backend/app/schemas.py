from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

class HealthResponse(BaseModel):
    """Response returned by the health-check endpoint."""

    status: Literal["ok"]

class DNAAnalysisRequest(BaseModel):
    """JSON body accepted by the DNA analysis endpoint."""

    sequence: str = Field(
        description="DNA sequence to normalize, validate, and analyze.",
        examples=["ATGC"],
    )

class BaseCounts(BaseModel):
    """Number of occurrences of each supported DNA base."""

    model_config = ConfigDict(populate_by_name=True)

    adenine: int = Field(alias="A", ge=0)
    thymine: int = Field(alias="T", ge=0)
    guanine: int = Field(alias="G", ge=0)
    cytosine: int = Field(alias="C", ge=0)

class DNAAnalysisResponse(BaseModel):
    """Successful DNA analysis returned by the API."""

    sequence: str
    length: int = Field(ge=1)
    counts: BaseCounts
    gc_content: float = Field(ge=0, le=100)
    at_content: float = Field(ge=0, le=100)
    complement: str
    reverse_complement: str
