import { StyleSheet, View, type ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";

export function SignPreview({
  svg,
  meta,
  style,
}: {
  svg: string;
  meta: { width: number; height: number };
  style?: ViewStyle;
}) {
  const aspectRatio = meta.width > 0 && meta.height > 0 ? meta.width / meta.height : 1;
  return (
    <View style={[styles.wrap, { aspectRatio }, style]}>
      <SvgXml xml={svg} width="100%" height="100%" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
