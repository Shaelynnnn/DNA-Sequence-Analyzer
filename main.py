VALID_BASES = {"A", "T", "G", "C"}
COMPLEMENT_MAP = str.maketrans({
    "A": "T",
    "T": "A",
    "G": "C",
    "C": "G",
})


def get_invalid_characters(sequence):
    return sorted(set(sequence) - VALID_BASES)


def count_bases(sequence):
    return {
        "A": sequence.count("A"),
        "T": sequence.count("T"),
        "G": sequence.count("G"),
        "C": sequence.count("C"),
    }


def calculate_gc_content(base_counts, sequence_length):
    gc_count = base_counts["G"] + base_counts["C"]
    return (gc_count / sequence_length) * 100


def generate_complementary_strand(sequence):
    return sequence.translate(COMPLEMENT_MAP)


def main():
    dna_sequence = input("Enter a DNA sequence: ").strip().upper()

    if not dna_sequence:
        print("Error: DNA sequence cannot be empty.")
        return

    invalid_characters = get_invalid_characters(dna_sequence)
    if invalid_characters:
        print("Invalid DNA sequence.")
        print(f"Illegal characters: {', '.join(invalid_characters)}")
        return

    base_counts = count_bases(dna_sequence)
    gc_content = calculate_gc_content(base_counts, len(dna_sequence))
    complementary_strand = generate_complementary_strand(dna_sequence)

    print("DNA sequence is valid.")
    print(f"A: {base_counts['A']}")
    print(f"T: {base_counts['T']}")
    print(f"G: {base_counts['G']}")
    print(f"C: {base_counts['C']}")
    print(f"GC content: {gc_content:.2f}%")
    print(f"Complementary strand: {complementary_strand}")


if __name__ == "__main__":
    main()
