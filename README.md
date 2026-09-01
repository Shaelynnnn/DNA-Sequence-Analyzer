# Helixora

Helixora is a full-stack DNA sequence analysis tool. It provides a responsive
React interface backed by a FastAPI service that normalizes, validates, and
analyzes DNA sequences.

## Features

- Accept DNA sequences containing `A`, `T`, `G`, and `C`.
- Accept typed or pasted sequences and uploaded FASTA or plain-text files.
- Support click-to-select and drag-and-drop file uploads up to 5 MB.
- Remove whitespace and normalize lowercase input to uppercase.
- Reject empty sequences and unsupported characters with clear error messages.
- Calculate total sequence length.
- Count every supported DNA base.
- Calculate GC and AT content percentages.
- Generate the complement and reverse complement.
- Display loading, validation, API, and network error states.
- Fill the input quickly with interactive example sequences.
- Adapt the interface for desktop and mobile screens.
- Provide automatically generated OpenAPI documentation.

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- CSS
- Oxlint

### Backend

- Python
- FastAPI
- Pydantic
- Uvicorn
- pytest

## Architecture

```text
User
  |
  v
React UI components
  |
  v
DNA API module (dna.ts)
  |
  v
HTTP client (client.ts)
  |
  v
FastAPI endpoints (main.py)
  |
  v
DNA analysis logic (analyzer.py)
```

The frontend separates page state, presentation components, API functions, and
HTTP transport. The backend separates HTTP endpoints, request and response
schemas, and domain analysis logic.

## Project Structure

```text
DNA-Sequence-Analyzer/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── analyzer.py          # DNA normalization and analysis logic
│   │   ├── main.py              # FastAPI application and endpoints
│   │   └── schemas.py           # Pydantic request and response schemas
│   ├── tests/
│   │   ├── test_analyzer.py     # Unit tests for DNA analysis
│   │   └── test_api.py          # API integration tests
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── public/                  # Public static assets
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts        # Shared HTTP client and API errors
│   │   │   ├── dna.ts           # DNA-specific API functions
│   │   │   ├── index.ts         # Public API-layer exports
│   │   │   └── types.ts         # API request and response types
│   │   ├── components/
│   │   │   ├── AnalysisResult.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── SequenceForm.tsx
│   │   ├── App.css              # Page and component styles
│   │   ├── App.tsx              # Page state and API coordination
│   │   ├── index.css            # Global styles and design tokens
│   │   └── main.tsx             # React application entry point
│   ├── .env.example             # Example frontend environment variables
│   ├── index.html               # Browser document entry point
│   └── package.json             # Frontend dependencies and scripts
└── README.md
```

## Requirements

- Python 3.10 or newer
- Node.js `^20.19.0` or `>=22.12.0`
- npm

## Installation

Clone the repository and enter its directory:

```bash
git clone <repository-url>
cd DNA-Sequence-Analyzer
```

### Backend setup

Create and activate a Python virtual environment:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

### Frontend setup

From the repository root:

```bash
cd frontend
npm install
```

The API base URL defaults to `http://localhost:8000`. To configure another
backend origin, create a local environment file:

```bash
cp .env.example .env
```

Then update:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Do not include a trailing slash in the URL.

## Running the Application

The frontend and backend must run at the same time. Use two terminal windows.

### Terminal 1: backend

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

The backend is available at:

- API origin: [http://localhost:8000](http://localhost:8000)
- Health check: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- Interactive API documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

### Terminal 2: frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in a browser.

The backend currently allows browser requests from `http://localhost:5173`.
Make sure port `5173` is available when starting Vite.

## Usage

1. Open the Helixora frontend.
2. Type or paste a DNA sequence, upload a `.fasta`, `.fa`, `.fna`, or `.txt`
   file, or select an example sequence.
3. Select **Analyze sequence**.
4. Review the normalized sequence, length, base counts, composition percentages,
   complement, and reverse complement.
5. Select **Clear** to reset the page.

Example input:

```text
 atgc
```

The input is normalized to `ATGC` and produces:

```text
Sequence length: 4 bp
A: 1
T: 1
G: 1
C: 1
GC content: 50.00%
AT content: 50.00%
Complement: TACG
Reverse complement: GCAT
```

## API

### Health check

```http
GET /api/health
```

Successful response:

```json
{
  "status": "ok"
}
```

### Analyze a DNA sequence

```http
POST /api/analyze
Content-Type: application/json
```

Request body:

```json
{
  "sequence": "ATGC"
}
```

Successful response:

```json
{
  "sequence": "ATGC",
  "length": 4,
  "counts": {
    "A": 1,
    "T": 1,
    "G": 1,
    "C": 1
  },
  "gc_content": 50.0,
  "at_content": 50.0,
  "complement": "TACG",
  "reverse_complement": "GCAT"
}
```

Invalid DNA characters return HTTP `400`:

```json
{
  "detail": "DNA sequence contains invalid characters: X"
}
```

## Testing and Quality Checks

### Backend tests

```bash
cd backend
source .venv/bin/activate
python -m pytest -q
```

### Frontend lint

```bash
cd frontend
npm run lint
```

### Frontend production build

```bash
cd frontend
npm run build
```

The production files are generated in `frontend/dist/`.

To preview the production build locally:

```bash
npm run preview
```

## Current Scope

Helixora currently performs direct DNA sequence analysis without storing user
data. It does not yet include authentication, a database, analysis history,
FASTA file uploads, RNA analysis, protein translation, or result downloads.
