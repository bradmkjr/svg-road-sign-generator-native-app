import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { DEST_DIRECTIONS, type Field } from "../lib/signFields";
import { ChipRow } from "./ChipRow";

type Props = {
  field: Field;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
};

/** One form control for a sign's field — text input, chip picker, or a
 *  repeatable "Name:miles[:direction]" destinations editor. */
export function FieldInput({ field, value, onChange }: Props) {
  if (field.kind === "text") {
    const v = typeof value === "string" ? value : "";
    return (
      <View style={styles.group}>
        <Text style={styles.label}>{field.label}</Text>
        <TextInput
          style={styles.input}
          value={v}
          onChangeText={onChange}
          placeholder={field.placeholder}
          autoCapitalize="characters"
        />
      </View>
    );
  }

  if (field.kind === "select") {
    const v = typeof value === "string" && value ? value : field.default;
    return (
      <View style={styles.group}>
        <Text style={styles.label}>{field.label}</Text>
        <ChipRow options={field.options} value={v} onChange={onChange} />
      </View>
    );
  }

  // field.kind === "destinations". Pull out the primitives the nested
  // functions below need — TS discriminated-union narrowing on `field` itself
  // doesn't survive into a nested function declaration.
  const { max, directed, default: fieldDefault } = field;
  const rows = Array.isArray(value) ? value : fieldDefault;
  const parsed = rows.map((r) => {
    const [name = "", miles = "", direction = ""] = r.split(":");
    return { name, miles, direction };
  });

  function serialize(next: typeof parsed): string[] {
    return next
      .filter((r) => r.name || r.miles)
      .map((r) =>
        directed
          ? `${r.name}:${r.miles}:${r.direction || DEST_DIRECTIONS[0].value}`
          : `${r.name}:${r.miles}`,
      );
  }

  function update(i: number, patch: Partial<{ name: string; miles: string; direction: string }>) {
    onChange(serialize(parsed.map((r, idx) => (idx === i ? { ...r, ...patch } : r))));
  }

  function addRow() {
    if (parsed.length >= max) return;
    onChange(serialize([...parsed, { name: "", miles: "", direction: DEST_DIRECTIONS[0].value }]));
  }

  function removeRow(i: number) {
    onChange(serialize(parsed.filter((_, idx) => idx !== i)));
  }

  return (
    <View style={styles.group}>
      <Text style={styles.label}>{field.label}</Text>
      {parsed.map((row, i) => (
        <View key={i} style={styles.destBlock}>
          <View style={styles.destRow}>
            <TextInput
              style={[styles.input, styles.destName]}
              value={row.name}
              onChangeText={(t) => update(i, { name: t })}
              placeholder="Name"
            />
            <TextInput
              style={[styles.input, styles.destMiles]}
              value={row.miles}
              onChangeText={(t) => update(i, { miles: t })}
              placeholder="mi"
              keyboardType="decimal-pad"
            />
            <Pressable onPress={() => removeRow(i)} style={styles.removeBtn} hitSlop={8}>
              <Text style={styles.removeBtnText}>✕</Text>
            </Pressable>
          </View>
          {directed && (
            <ChipRow
              options={DEST_DIRECTIONS as unknown as { value: string; label: string }[]}
              value={row.direction || DEST_DIRECTIONS[0].value}
              onChange={(v) => update(i, { direction: v })}
            />
          )}
        </View>
      ))}
      {parsed.length < max && (
        <Pressable onPress={addRow} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add destination</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#344054",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  destBlock: {
    marginBottom: 10,
  },
  destRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  destName: {
    flex: 3,
  },
  destMiles: {
    flex: 1,
  },
  removeBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  removeBtnText: {
    color: "#98a2b3",
    fontSize: 16,
  },
  addBtn: {
    alignSelf: "flex-start",
    paddingVertical: 6,
  },
  addBtnText: {
    color: "#0b3d2e",
    fontWeight: "600",
  },
});
