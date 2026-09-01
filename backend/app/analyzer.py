# Canonical and IUPAC ambiguity symbols accepted for DNA sequences.
CANONICAL_BASES = ("A", "T", "G", "C")
AMBIGUITY_BASES = ("R", "Y", "S", "W", "K", "M", "B", "D", "H", "V", "N")
VALID_BASES = frozenset((*CANONICAL_BASES, *AMBIGUITY_BASES))

# Fractional GC contribution used for the expected GC-content calculation.
GC_PROBABILITY = {
    "A": 0.0,
    "T": 0.0,
    "G": 1.0,
    "C": 1.0,
    "R": 0.5,       # A or G
    "Y": 0.5,       # C or T
    "S": 1.0,       # G or C
    "W": 0.0,       # A or T
    "K": 0.5,       # G or T
    "M": 0.5,       # A or C
    "B": 2 / 3,     # C, G, or T
    "D": 1 / 3,     # A, G, or T
    "H": 1 / 3,     # A, C, or T
    "V": 2 / 3,     # A, C, or G
    "N": 0.5,       # Any base
}

COMPLEMENT_MAP = str.maketrans(
    {
        "A": "T",
        "T": "A",
        "G": "C",
        "C": "G",
        "R": "Y",
        "Y": "R",
        "S": "S",
        "W": "W",
        "K": "M",
        "M": "K",
        "B": "V",
        "V": "B",
        "D": "H",
        "H": "D",
        "N": "N",
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


def count_ambiguity_bases(sequence: str) -> dict[str, int]:
    """Count every supported IUPAC ambiguity symbol."""
    return {base: sequence.count(base) for base in AMBIGUITY_BASES}


def calculate_gc_content(sequence: str) -> float:
    """Return expected GC percentage, including ambiguous IUPAC bases."""
    expected_gc_count = sum(GC_PROBABILITY[base] for base in sequence)
    return round((expected_gc_count / len(sequence)) * 100, 2)


def calculate_at_content(sequence: str) -> float:
    """Return expected AT percentage, including ambiguous IUPAC bases."""
    return round(100 - calculate_gc_content(sequence), 2)


def calculate_gc_content_range(sequence: str) -> tuple[float, float]:
    """Return minimum and maximum possible GC percentages."""
    certain_gc_count = sum(base in {"G", "C", "S"} for base in sequence)
    possible_gc_count = sum(base not in {"A", "T", "W"} for base in sequence)
    return (
        round((certain_gc_count / len(sequence)) * 100, 2),
        round((possible_gc_count / len(sequence)) * 100, 2),
    )


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

    ambiguity_counts = count_ambiguity_bases(normalized_sequence)
    ambiguity_count = sum(ambiguity_counts.values())
    gc_content_min, gc_content_max = calculate_gc_content_range(
        normalized_sequence
    )

    return {
        "sequence": normalized_sequence,
        "length": len(normalized_sequence),
        "counts": count_bases(normalized_sequence),
        "gc_content": calculate_gc_content(normalized_sequence),
        "gc_content_min": gc_content_min,
        "gc_content_max": gc_content_max,
        "at_content": calculate_at_content(normalized_sequence),
        "ambiguity_count": ambiguity_count,
        "ambiguity_percentage": round(
            (ambiguity_count / len(normalized_sequence)) * 100, 2
        ),
        "ambiguity_counts": ambiguity_counts,
        "complement": generate_complement(normalized_sequence),
        "reverse_complement": generate_reverse_complement(normalized_sequence),
    }
