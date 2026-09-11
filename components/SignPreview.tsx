import { StyleSheet, View, type ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";

export function SignPreview({
  svg,
  meta,
  style,
  height,
}: {
  svg: string;
  meta: { width: number; height: number };
  style?: ViewStyle;
  /**
   * Fixed pixel height, letterboxed (the SVG's own viewBox + default
   * `preserveAspectRatio` centers and contains it) — for grid cards, where a
   * tall/narrow sign (milepost, do-not-enter) must not grow past its cell.
   * Omit to size the box to the sign's own aspect ratio instead (the builder's
   * full-width preview).
   */
  height?: number;
}) {
  const sizeStyle: ViewStyle =
    height != null
      ? { height, overflow: "hidden" }
      : { aspectRatio: meta.width > 0 && meta.height > 0 ? meta.width / meta.height : 1 };

  return (
    <View style={[styles.wrap, sizeStyle, style]}>
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
