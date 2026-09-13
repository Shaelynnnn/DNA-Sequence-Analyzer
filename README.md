# Helixora

A DNA sequence analyzer built with React and TypeScript. The hosted application
runs in the browser; a Python/FastAPI implementation is also included in `backend/`.

## Features

- Paste a sequence or upload one FASTA/plain-text file (up to 5 MB).
- Normalize whitespace and lowercase input, and reject invalid characters.
- Calculate base counts, GC/AT content, complements, and reverse complements.
- Handle IUPAC ambiguity codes and show an expected GC value and possible range.
- Try built-in example sequences without preparing a file.

Ambiguous nucleotides are weighted equally across their possible bases. For
example, N contributes 0.5 to the expected GC count. This is a calculation
assumption, not an estimate from experimental data.

## Run locally

Use Node.js 24 for the frontend and its tests.

```sh
cd frontend
npm ci
npm run dev
```

Open the address printed by Vite. No backend or environment file is needed for
the default browser mode. Sequence data stays in the browser in this mode.

## Optional Python API

Use Python 3.10 or newer:

```sh
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

To connect the React frontend, create `frontend/.env.local` with:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Restart Vite after changing the environment file. In API mode, submitted
sequences are sent to the backend. The API accepts requests from the local
frontend at `http://localhost:5173`.

- `GET /api/health`: service status.
- `POST /api/analyze`: JSON body such as `{"sequence": "ATGC"}`.
- `/docs`: interactive API documentation.

## Checks

```sh
cd frontend
npm test
npm run lint
npm run build
```

```sh
cd backend
.venv/bin/python -m pytest -q
```

The frontend tests cover sequence analysis, ambiguity codes, invalid input,
and file parsing. The backend has unit tests and API tests.

## Structure

- `frontend/src/App.tsx`: input state and analysis flow.
- `frontend/src/components/`: form, upload dialog, results, and errors.
- `frontend/src/utils/dnaAnalyzer.ts`: browser-side DNA calculations.
- `frontend/src/utils/analyzeSequence.ts`: selects browser or API mode.
- `frontend/src/utils/sequenceFile.ts`: FASTA and text parsing.
- `frontend/src/api/`: optional HTTP client and shared response types.
- `backend/app/analyzer.py`: Python DNA calculations.
- `backend/app/main.py`: FastAPI endpoints.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for GitHub Pages setup. The workflow publishes
only the built frontend. GitHub Pages does not run the Python backend.

## Scope

The app analyzes one DNA sequence at a time. It does not store analysis history,
translate proteins, or accept multi-record FASTA files.
