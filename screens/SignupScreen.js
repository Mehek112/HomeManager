// import { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

// export default function SignupScreen({ navigation, setUser }) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [error, setError] = useState("");

//   const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

//   const isStrongPassword = (password) =>
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

//   const handleSignup = () => {
//     setError("");

//     if (!name) return setError("Name is required");
//     if (!email) return setError("Email is required");
//     if (!isValidEmail(email)) return setError("Invalid email format");

//     if (!password) return setError("Password is required");
//     if (!isStrongPassword(password)) {
//       return setError(
//         "Password must contain 8+ chars, uppercase, lowercase, number & special character"
//       );
//     }

//     // SUCCESS → go directly to dashboard
//     setUser({
//       name,
//       email,
//     });
//   };

//   return (
//     <View style={s.container}>

//       {/* BACK BUTTON */}
//       <TouchableOpacity
//         style={s.backBtn}
//         onPress={() => navigation.navigate("Login")}
//       >
//         <Text style={s.backText}>{"<"}</Text>
//       </TouchableOpacity>

//       <Text style={s.title}>Create Account</Text>

//       <TextInput
//         style={s.input}
//         placeholder="Name"
//         value={name}
//         onChangeText={setName}
//       />

//       <TextInput
//         style={s.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//       />

//       <TextInput
//         style={s.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />

//       {error ? <Text style={s.error}>{error}</Text> : null}

//       <TouchableOpacity style={s.btn} onPress={handleSignup}>
//         <Text style={s.btnText}>Sign Up</Text>
//       </TouchableOpacity>

//     </View>
//   );
// }

// const s = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//   },

//   backBtn: {
//     position: "absolute",
//     top: 50,
//     left: 20,
//   },

//   backText: {
//     fontSize: 28,
//     fontWeight: "700",
//     color: "#F26419",
//   },

//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     marginBottom: 20,
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//   },

//   error: {
//     color: "red",
//     marginBottom: 10,
//   },

//   btn: {
//     backgroundColor: "#F26419",
//     padding: 14,
//     borderRadius: 8,
//     marginTop: 10,
//   },

//   btnText: {
//     color: "white",
//     textAlign: "center",
//     fontWeight: "700",
//   },
// });
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function SignupScreen({ navigation, setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  const handleSignup = () => {
    setError("");

    if (!name) return setError("Name is required");
    if (!email) return setError("Email is required");
    if (!isValidEmail(email)) return setError("Invalid email format");

    if (!password) return setError("Password is required");
    if (!isStrongPassword(password)) {
      return setError(
        "Password must contain 8+ chars, uppercase, lowercase, number & special character"
      );
    }

    const newUser = { name, email };

    setUser(newUser);

    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
    });
  };

  return (
    <View style={s.container}>

      <TouchableOpacity
        style={s.backBtn}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={s.backText}>{"<"}</Text>
      </TouchableOpacity>

      <Text style={s.title}>Create Account</Text>

      <TextInput style={s.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={s.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      {error ? <Text style={s.error}>{error}</Text> : null}

      <TouchableOpacity style={s.btn} onPress={handleSignup}>
        <Text style={s.btnText}>Sign Up</Text>
      </TouchableOpacity>

    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },

  backBtn: { position: "absolute", top: 50, left: 20 },

  backText: { fontSize: 28, fontWeight: "700", color: "#F26419" },

  title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  error: { color: "red", marginBottom: 10 },

  btn: {
    backgroundColor: "#F26419",
    padding: 14,
    borderRadius: 8,
  },

  btnText: { color: "white", textAlign: "center", fontWeight: "700" },
});