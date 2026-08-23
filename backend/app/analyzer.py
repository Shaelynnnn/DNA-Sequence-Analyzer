# only DNA bases are supported, so we can use a set for fast membership testing
VALID_BASES = frozenset({"A", "T", "G", "C"})

COMPLEMENT_MAP = str.maketrans(
    {
        "A": "T",
        "T": "A",
        "G": "C",
        "C": "G",
    }
)

# change the input to uppercase and remove whitespace to make it easier to validate and analyze
def normalize_sequence(sequence: str) -> str:
    """Return an uppercase DNA sequence with all whitespace removed."""
    return "".join(sequence.split()).upper()


def validate_sequence(sequence: str) -> None:
    """Raise ValueError when a normalized sequence is empty or invalid."""
    if not sequence:
        raise ValueError("DNA sequence cannot be empty.")

    invalid_characters = sorted(set(sequence) - VALID_BASES)
    if invalid_characters:
        invalid_list = ", ".join(invalid_characters)
        raise ValueError(
            f"DNA sequence contains invalid characters: {invalid_list}"
        )


def count_bases(sequence: str) -> dict[str, int]:
    """Count every supported DNA base, including bases with zero matches."""
    return {
        "A": sequence.count("A"),
        "T": sequence.count("T"),
        "G": sequence.count("G"),
        "C": sequence.count("C"),
    }


def calculate_gc_content(sequence: str) -> float:
    """Return the percentage of G and C bases, rounded to two decimals."""
    counts = count_bases(sequence)
    gc_count = counts["G"] + counts["C"]
    return round((gc_count / len(sequence)) * 100, 2)


def calculate_at_content(sequence: str) -> float:
    """Return the percentage of A and T bases, rounded to two decimals."""
    counts = count_bases(sequence)
    at_count = counts["A"] + counts["T"]
    return round((at_count / len(sequence)) * 100, 2)


def generate_complement(sequence: str) -> str:
    """Return the complementary DNA strand."""
    return sequence.translate(COMPLEMENT_MAP)


def generate_reverse_complement(sequence: str) -> str:
    """Return the complementary DNA strand in reverse order."""
    return generate_complement(sequence)[::-1]


def analyze_dna(sequence: str) -> dict:
    """Normalize, validate, and return a complete DNA analysis."""
    normalized_sequence = normalize_sequence(sequence)
    validate_sequence(normalized_sequence)

    return {
        "sequence": normalized_sequence,
        "length": len(normalized_sequence),
        "counts": count_bases(normalized_sequence),
        "gc_content": calculate_gc_content(normalized_sequence),
        "at_content": calculate_at_content(normalized_sequence),
        "complement": generate_complement(normalized_sequence),
        "reverse_complement": generate_reverse_complement(normalized_sequence),
    }
