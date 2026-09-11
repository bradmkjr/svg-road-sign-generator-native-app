import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError, getSigns } from "../lib/api";
import type { SignInfo } from "../lib/types";
import { SignCard } from "../components/SignCard";

export default function HomeScreen() {
  const [signs, setSigns] = useState<SignInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    return getSigns()
      .then((s) => {
        setSigns(s);
        setError(null);
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : "Something went wrong"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load().finally(() => setRefreshing(false));
  }, [load]);

  if (error) {
    return (
      <SafeAreaView style={styles.center} edges={["bottom"]}>
        <Text style={styles.errorTitle}>Can't reach the sign API</Text>
        <Text style={styles.errorBody}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!signs) {
    return (
      <SafeAreaView style={styles.center} edges={["bottom"]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <FlatList
        data={signs}
        keyExtractor={(s) => s.type}
        numColumns={2}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => <SignCard sign={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  list: {
    padding: 6,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f7f8fa",
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
});
