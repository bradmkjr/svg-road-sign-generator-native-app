import { useState } from "react";
import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { File, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { signPngUrl, type SignParams } from "../lib/api";
import type { SignType } from "../lib/types";

type ActionState = "idle" | "working" | "done";

/** Downloads the sign's PNG to a scratch file in the cache directory. Each
 *  call gets a fresh filename so concurrent Save/Copy taps never collide. */
async function downloadPng(type: SignType, params: SignParams): Promise<File> {
  const url = signPngUrl(type, params);
  const destination = new File(Paths.cache, `${type}-${Date.now()}.png`);
  return File.downloadFileAsync(url, destination, { idempotent: true });
}

/** "Save to Photos" / "Copy image" buttons below the sign preview — native
 *  only (expo-media-library and image clipboard support don't exist on web). */
export function SignActions({ type, params }: { type: SignType; params: SignParams }) {
  const [saveState, setSaveState] = useState<ActionState>("idle");
  const [copyState, setCopyState] = useState<ActionState>("idle");

  if (Platform.OS === "web") return null;

  async function handleSave() {
    if (saveState === "working") return;
    setSaveState("working");
    try {
      const perm = await MediaLibrary.requestPermissionsAsync(true);
      if (perm.status !== "granted") {
        Alert.alert(
          "Photos access needed",
          "Enable photo library access for Road Signs in Settings to save signs.",
        );
        setSaveState("idle");
        return;
      }
      const file = await downloadPng(type, params);
      await MediaLibrary.Asset.create(file.uri);
      setSaveState("done");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (e) {
      Alert.alert("Couldn't save", e instanceof Error ? e.message : "Something went wrong.");
      setSaveState("idle");
    }
  }

  async function handleCopy() {
    if (copyState === "working") return;
    setCopyState("working");
    try {
      const file = await downloadPng(type, params);
      const base64 = await file.base64();
      await Clipboard.setImageAsync(base64);
      setCopyState("done");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch (e) {
      Alert.alert("Couldn't copy", e instanceof Error ? e.message : "Something went wrong.");
      setCopyState("idle");
    }
  }

  return (
    <View style={styles.row}>
      <ActionButton label="Save to Photos" doneLabel="Saved ✓" state={saveState} onPress={handleSave} />
      <ActionButton label="Copy image" doneLabel="Copied ✓" state={copyState} onPress={handleCopy} />
    </View>
  );
}

function ActionButton({
  label,
  doneLabel,
  state,
  onPress,
}: {
  label: string;
  doneLabel: string;
  state: ActionState;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={state === "working"}
      style={[styles.button, state === "done" && styles.buttonDone]}
    >
      {state === "working" ? (
        <ActivityIndicator color="#0b3d2e" size="small" />
      ) : (
        <Text style={styles.buttonText}>{state === "done" ? doneLabel : label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0b3d2e",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDone: {
    backgroundColor: "#e6f4ea",
  },
  buttonText: {
    color: "#0b3d2e",
    fontWeight: "600",
    fontSize: 13,
  },
});
