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

class AmbiguityCounts(BaseModel):
    """Counts for every supported IUPAC ambiguity symbol."""

    model_config = ConfigDict(populate_by_name=True)

    purine: int = Field(alias="R", ge=0)
    pyrimidine: int = Field(alias="Y", ge=0)
    strong: int = Field(alias="S", ge=0)
    weak: int = Field(alias="W", ge=0)
    keto: int = Field(alias="K", ge=0)
    amino: int = Field(alias="M", ge=0)
    not_adenine: int = Field(alias="B", ge=0)
    not_cytosine: int = Field(alias="D", ge=0)
    not_guanine: int = Field(alias="H", ge=0)
    not_thymine: int = Field(alias="V", ge=0)
    any_base: int = Field(alias="N", ge=0)

class DNAAnalysisResponse(BaseModel):
    """Successful DNA analysis returned by the API."""

    sequence: str
    length: int = Field(ge=1)
    counts: BaseCounts
    gc_content: float = Field(ge=0, le=100)
    gc_content_min: float = Field(ge=0, le=100)
    gc_content_max: float = Field(ge=0, le=100)
    at_content: float = Field(ge=0, le=100)
    ambiguity_count: int = Field(ge=0)
    ambiguity_percentage: float = Field(ge=0, le=100)
    ambiguity_counts: AmbiguityCounts
    complement: str
    reverse_complement: str
