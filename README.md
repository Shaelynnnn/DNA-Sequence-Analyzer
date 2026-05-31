# DNA Sequence Analyzer

A simple Python command-line tool for analyzing DNA sequences.

## Features
- Validate DNA sequences
- Count A, T, G, C bases
- Calculate GC content
- Generate a complementary strand

## How to run
```bash
python3 main.py
```

Then enter a DNA sequence when prompted.

## Example

Input:

```text
ATGCCGTA
```

Output:

```text
DNA sequence is valid.
A: 2
T: 2
G: 2
C: 2
GC content: 50.00%
Complementary strand: TACGGCAT
```

If the sequence contains invalid characters, the program lists them and stops
before calculating results.
