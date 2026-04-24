import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/services/firebase";

export default function LoginScreen({ navigation, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async () => {
    setError("");

    if (!email) return setError("Email is required");
    if (!isValidEmail(email)) return setError("Invalid email format");
    if (!password) return setError("Password is required");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      setUser({
        name: user.displayName || "User",
        email: user.email,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: "Dashboard" }],
      });

    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <View style={s.container}>

      {/* BACK BUTTON */}
      <TouchableOpacity
        style={s.backBtn}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={s.backText}>{"<"}</Text>
      </TouchableOpacity>

      <Text style={s.title}>Login</Text>

      <TextInput
        style={s.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={s.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={s.error}>{error}</Text> : null}

      <TouchableOpacity style={s.btn} onPress={handleLogin}>
        <Text style={s.btnText}>Login</Text>
      </TouchableOpacity>

      {/* 🔥 CREATE ACCOUNT LINK */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Signup")}
        style={s.linkBtn}
      >
        <Text style={s.linkText}>
          Don't have an account? Create one
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
  },

  backText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F26419",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  error: {
    color: "red",
    marginBottom: 10,
  },

  btn: {
    backgroundColor: "#F26419",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },

  btnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },

  // 🔥 NEW STYLES
  linkBtn: {
    marginTop: 15,
    alignItems: "center",
  },

  linkText: {
    color: "#F26419",
    fontWeight: "600",
  },
});