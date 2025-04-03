import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const Screen3 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.navigate("Login")} // Navigate to Login.js
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Image
        source={require("./assets/screen3.png")} // Correct image path
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Uncover Infinite Opportunities</Text>
      <Text style={styles.subtitle}>
        Alerts On Events And Participate In The Events And Embrace Your Journey
      </Text>

      <View style={styles.pagination}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate("Screen4")}
      >
        <Text style={styles.continueText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 20,
  },
  skipText: {
    fontSize: 14,
    color: "#333",
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginTop: 5,
    marginBottom: 20,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#000",
  },
  continueButton: {
    backgroundColor: "#4A6FF0",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Screen3;