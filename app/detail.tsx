import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

export default function Detail() {
  const { title, description, image } = useLocalSearchParams();

  const scale = useRef(new Animated.Value(0.95)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageWrapper}>
        <Animated.Image
          source={{ uri: image as string }}
          style={[
            styles.image,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#111827",
    flexGrow: 1,
  },
  imageWrapper: {
    width: "100%",
    backgroundColor: "#020617",
    borderRadius: 16,
    marginBottom: 20,
    paddingVertical: 24,         // equal padding top & bottom
    paddingHorizontal: 16,
    justifyContent: "center",    // center vertically inside wrapper
    alignItems: "center",        // center horizontally
  },
  image: {
    width: width - 80,
    height: undefined,
    aspectRatio: 1.4,            // keeps a nice proportion
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: "#d1d5db",
    lineHeight: 22,
  },
});
