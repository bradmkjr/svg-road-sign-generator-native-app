import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { getSign } from "../lib/api";
import type { SignInfo, SignMeta } from "../lib/types";
import { defaultsFor } from "../lib/signFields";
import { SignPreview } from "./SignPreview";

/** A home-grid tile: fetches its own default-params preview and links into
 *  the builder for that sign type. */
export function SignCard({ sign }: { sign: SignInfo }) {
  const [result, setResult] = useState<{ svg: string; meta: SignMeta } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSign(sign.type, defaultsFor(sign.type))
      .then((r) => {
        if (!cancelled) setResult(r);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [sign.type]);

  return (
    <Link href={`/signs/${sign.type}`} asChild>
      <Pressable style={styles.card}>
        <View style={styles.previewWrap}>
          {result ? (
            <SignPreview svg={result.svg} meta={result.meta} />
          ) : failed ? (
            <Text style={styles.errorText}>Preview unavailable</Text>
          ) : (
            <ActivityIndicator />
          )}
        </View>
        <Text style={styles.label} numberOfLines={2}>
          {sign.label}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eaecf0",
    padding: 12,
    margin: 6,
  },
  previewWrap: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1d2939",
    textAlign: "center",
  },
  errorText: {
    fontSize: 11,
    color: "#98a2b3",
    textAlign: "center",
  },
});
