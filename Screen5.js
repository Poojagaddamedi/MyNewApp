import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const Screen5 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/screen5.png")} // Updated image path
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Join SkillShare To Jumpstart Your Learning</Text>
      <Text style={styles.subtitle}>ALL THE BEST... LET'S BEGIN YOUR JOURNEY</Text>

      <View style={styles.pagination}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => navigation.navigate("Login")} // Navigate to Login.js
        >
          <Text style={styles.signInText}>SIGN IN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate("Signup")} // Navigate to Signup.js
        >
          <Text style={styles.signUpText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 20,
  },
  signInButton: {
    backgroundColor: "#4A6FF0",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  signInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpButton: {
    borderWidth: 2,
    borderColor: "#4A6FF0",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  signUpText: {
    color: "#4A6FF0",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Screen5;