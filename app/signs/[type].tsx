import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { ApiError, getSign, type SignParams } from "../../lib/api";
import { SIGN_TYPES, type SignMeta, type SignType } from "../../lib/types";
import { SIGN_FIELDS, defaultsFor } from "../../lib/signFields";
import { PALETTES } from "../../lib/palettes";
import { SignPreview } from "../../components/SignPreview";
import { SignActions } from "../../components/SignActions";
import { FieldInput } from "../../components/FieldInput";

function isSignType(x: string): x is SignType {
  return (SIGN_TYPES as readonly string[]).includes(x);
}

export default function SignBuilderScreen() {
  const { type: rawType } = useLocalSearchParams<{ type: string }>();
  const type = typeof rawType === "string" ? rawType : "";

  if (!isSignType(type)) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: "Not found" }} />
        <Text style={styles.errorTitle}>Unknown sign type</Text>
        <Text style={styles.errorBody}>"{type}" isn't a sign this app knows about.</Text>
      </View>
    );
  }

  // Remounts the builder when the type changes (tapping a different card),
  // instead of trying to reconcile unrelated field sets in place.
  return <SignBuilder key={type} type={type} />;
}

function SignBuilder({ type }: { type: SignType }) {
  const fields = SIGN_FIELDS[type] ?? [];
  const [params, setParams] = useState<SignParams>(() => defaultsFor(type));
  const [result, setResult] = useState<{ svg: string; meta: SignMeta } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSign(type, params)
      .then((r) => {
        if (cancelled) return;
        setResult(r);
        setError(null);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof ApiError ? e.message : "Something went wrong");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // Refetch whenever any param value changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, JSON.stringify(params)]);

  function setParam(name: string, value: string | string[]) {
    setParams((p) => ({ ...p, [name]: value }));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: type }} />

      <View style={styles.previewCard}>
        {result ? (
          <SignPreview svg={result.svg} meta={result.meta} />
        ) : loading ? (
          <ActivityIndicator size="large" />
        ) : null}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {result && <SignActions type={type} params={params} />}

      {fields.map((field) => (
        <FieldInput
          key={field.name}
          field={field}
          value={params[field.name]}
          onChange={(v) => setParam(field.name, v)}
        />
      ))}

      <FieldInput
        field={{
          name: "palette",
          label: "Color palette",
          kind: "select",
          default: "standard",
          options: PALETTES.map((p) => ({ value: p.id, label: p.label })),
        }}
        value={typeof params.palette === "string" ? params.palette : "standard"}
        onChange={(v) => setParam("palette", v)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  previewCard: {
    minHeight: 160,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f8fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  errorBody: {
    fontSize: 13,
    color: "#667085",
    textAlign: "center",
  },
  error: {
    color: "#c8102e",
    fontSize: 13,
    marginBottom: 12,
  },
});
