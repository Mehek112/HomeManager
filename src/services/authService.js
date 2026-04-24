import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";

// SIGNUP
export const registerUser = async (email, password, name) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  // store name in Firebase user profile
  await updateProfile(userCred.user, {
    displayName: name,
  });

  return userCred.user;
};

// LOGIN
export const loginUser = async (email, password) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
};

// LOGOUT
export const logoutUser = async () => {
  return signOut(auth);
};