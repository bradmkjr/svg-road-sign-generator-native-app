import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

export function ChipRow({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d0d5dd",
    backgroundColor: "#fff",
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: "#0b3d2e",
    borderColor: "#0b3d2e",
  },
  chipText: {
    fontSize: 13,
    color: "#344054",
  },
  chipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
});
