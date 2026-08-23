import pytest

from app.analyzer import (
    analyze_dna,
    calculate_at_content,
    calculate_gc_content,
    count_bases,
    generate_complement,
    generate_reverse_complement,
    normalize_sequence,
    validate_sequence,
)


@pytest.mark.parametrize(
    ("raw_sequence", "expected"),
    [
        ("atgc", "ATGC"),
        (" atgc ", "ATGC"),
        ("atgc\nggta", "ATGCGGTA"),
        (" a\tt\ng c ", "ATGC"),
    ],
)
def test_normalize_sequence(raw_sequence: str, expected: str) -> None:
    assert normalize_sequence(raw_sequence) == expected


def test_validate_sequence_accepts_valid_dna() -> None:
    assert validate_sequence("ATGC") is None


def test_validate_sequence_rejects_empty_dna() -> None:
    with pytest.raises(ValueError) as error:
        validate_sequence("")

    assert str(error.value) == "DNA sequence cannot be empty."


def test_validate_sequence_reports_unique_invalid_characters() -> None:
    with pytest.raises(ValueError) as error:
        validate_sequence("ATGNNXX")

    assert str(error.value) == "DNA sequence contains invalid characters: N, X"


def test_validate_sequence_rejects_non_dna_characters() -> None:
    with pytest.raises(ValueError) as error:
        validate_sequence("ATGU1!")

    assert str(error.value) == "DNA sequence contains invalid characters: !, 1, U"


def test_count_bases_counts_all_bases() -> None:
    assert count_bases("AATTGGCC") == {"A": 2, "T": 2, "G": 2, "C": 2}


def test_count_bases_includes_bases_with_zero_matches() -> None:
    assert count_bases("AAAA") == {"A": 4, "T": 0, "G": 0, "C": 0}


@pytest.mark.parametrize(
    ("sequence", "expected_gc", "expected_at"),
    [
        ("ATGC", 50.0, 50.0),
        ("GGCC", 100.0, 0.0),
        ("AATT", 0.0, 100.0),
        ("ATG", 33.33, 66.67),
    ],
)
def test_calculate_content(
    sequence: str,
    expected_gc: float,
    expected_at: float,
) -> None:
    assert calculate_gc_content(sequence) == expected_gc
    assert calculate_at_content(sequence) == expected_at


def test_generate_complement() -> None:
    assert generate_complement("ATGC") == "TACG"


def test_generate_reverse_complement() -> None:
    assert generate_reverse_complement("ATGC") == "GCAT"


def test_analyze_dna_returns_complete_analysis() -> None:
    assert analyze_dna(" atgc\n ") == {
        "sequence": "ATGC",
        "length": 4,
        "counts": {"A": 1, "T": 1, "G": 1, "C": 1},
        "gc_content": 50.0,
        "at_content": 50.0,
        "complement": "TACG",
        "reverse_complement": "GCAT",
    }


@pytest.mark.parametrize(
    ("raw_sequence", "expected_message"),
    [
        (" \n\t ", "DNA sequence cannot be empty."),
        ("atgnx", "DNA sequence contains invalid characters: N, X"),
    ],
)
def test_analyze_dna_rejects_invalid_input(
    raw_sequence: str,
    expected_message: str,
) -> None:
    with pytest.raises(ValueError) as error:
        analyze_dna(raw_sequence)

    assert str(error.value) == expected_message
