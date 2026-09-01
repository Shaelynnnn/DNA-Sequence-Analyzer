"""Integration tests for the FastAPI HTTP endpoints."""

from fastapi.testclient import TestClient

from app.main import app


# TestClient lets the tests call the API without starting a real web server.
client = TestClient(app)


def test_health_check_returns_ok() -> None:
    """The health endpoint should confirm that the API is available."""
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_cors_allows_vite_development_server() -> None:
    """The browser preflight request should allow the local React frontend."""
    response = client.options(
        "/api/analyze",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == (
        "http://localhost:5173"
    )
    assert "POST" in response.headers["access-control-allow-methods"]


def test_analyze_valid_sequence_returns_complete_analysis() -> None:
    """A valid sequence should be normalized and fully analyzed."""
    response = client.post(
        "/api/analyze",
        json={"sequence": " atgc\n "},
    )

    assert response.status_code == 200
    assert response.json() == {
        "sequence": "ATGC",
        "length": 4,
        "counts": {
            "A": 1,
            "T": 1,
            "G": 1,
            "C": 1,
        },
        "gc_content": 50.0,
        "gc_content_min": 50.0,
        "gc_content_max": 50.0,
        "at_content": 50.0,
        "ambiguity_count": 0,
        "ambiguity_percentage": 0.0,
        "ambiguity_counts": {
            "R": 0,
            "Y": 0,
            "S": 0,
            "W": 0,
            "K": 0,
            "M": 0,
            "B": 0,
            "D": 0,
            "H": 0,
            "V": 0,
            "N": 0,
        },
        "complement": "TACG",
        "reverse_complement": "GCAT",
    }


def test_analyze_invalid_sequence_returns_bad_request() -> None:
    """Unsupported DNA characters should produce a client-facing error."""
    response = client.post(
        "/api/analyze",
        json={"sequence": "ATGX"},
    )

    assert response.status_code == 400
    assert response.json() == {
        "detail": "DNA sequence contains invalid characters: X"
    }


def test_analyze_iupac_sequence_returns_ambiguity_analysis() -> None:
    """IUPAC symbols should be preserved and analyzed transparently."""
    response = client.post("/api/analyze", json={"sequence": "ATGN"})

    assert response.status_code == 200
    result = response.json()
    assert result["sequence"] == "ATGN"
    assert result["ambiguity_count"] == 1
    assert result["ambiguity_counts"]["N"] == 1
    assert result["gc_content"] == 37.5
    assert result["gc_content_min"] == 25.0
    assert result["gc_content_max"] == 50.0
    assert result["reverse_complement"] == "NCAT"


def test_analyze_empty_sequence_returns_bad_request() -> None:
    """A sequence containing only whitespace should be rejected."""
    response = client.post(
        "/api/analyze",
        json={"sequence": " \n\t "},
    )

    assert response.status_code == 400
    assert response.json() == {"detail": "DNA sequence cannot be empty."}


def test_analyze_missing_sequence_returns_validation_error() -> None:
    """FastAPI should reject a request that omits the required field."""
    response = client.post("/api/analyze", json={})

    assert response.status_code == 422

    # Avoid asserting Pydantic's entire error message, which may vary by version.
    error = response.json()["detail"][0]
    assert error["loc"] == ["body", "sequence"]
    assert error["type"] == "missing"
