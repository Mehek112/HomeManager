import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import DashboardScreen from "../screens/DashboardScreen";
import HomeListScreen from "../screens/HomeListScreen";
import RoomListScreen from "../screens/RoomListScreen";
import InventoryScreen from "../screens/InventoryScreen";
import InvoiceScreen from "../screens/InvoiceScreen"; // ✅ FIX ADDED

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [user, setUser] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {!user ? (
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setUser={setUser} />}
            </Stack.Screen>

            <Stack.Screen name="Signup">
              {(props) => <SignupScreen {...props} setUser={setUser} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard">
              {(props) => (
                <DashboardScreen {...props} user={user} setUser={setUser} />
              )}
            </Stack.Screen>

            <Stack.Screen name="HomeList">
              {(props) => <HomeListScreen {...props} user={user} />}
            </Stack.Screen>

            <Stack.Screen name="Rooms">
              {(props) => <RoomListScreen {...props} user={user} />}
            </Stack.Screen>

            {/* INVENTORY */}
            <Stack.Screen name="Inventory">
              {(props) => <InventoryScreen {...props} user={user} />}
            </Stack.Screen>

            {/* INVOICE SCREEN */}
            <Stack.Screen name="InvoiceScreen">
              {(props) => <InvoiceScreen {...props} user={user} />}
            </Stack.Screen>

          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}
