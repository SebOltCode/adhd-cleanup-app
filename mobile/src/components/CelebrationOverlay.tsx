import { LinearGradient } from "expo-linear-gradient";
import { Animated, StyleSheet, Text } from "react-native";
import { useEffect, useRef } from "react";

type CelebrationOverlayProps = {
  visible: boolean;
};

export const CelebrationOverlay = ({ visible }: CelebrationOverlayProps) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: visible ? 300 : 250,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.container, { opacity }]}
    >
      <LinearGradient
        colors={["rgba(52,104,204,0.95)", "rgba(255,144,232,0.85)"]}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>Yeah!</Text>
      <Text style={styles.subtitle}>Aufgabe erledigt – Dopamin-Power aktiviert!</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
  },
});
