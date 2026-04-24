import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getHomes } from "../services/api";

const TASK_KEY = "TASKS_DATA";
const HOMES_KEY = "HOMES_DATA";

const C = {
  orange: "#F26419",
  orangeLight: "#FFF0E8",
  orangeMid: "#FDDCCA",
  orangeDark: "#C04A0C",
  black: "#1A1208",
  gray: "#7A6E64",
  grayLight: "#F5F2EE",
  white: "#FFFFFF",
  border: "#E8E0E8",
};

export default function DashboardScreen({ navigation, user, setUser }) {
  const [homes, setHomes] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [taskModal, setTaskModal] = useState(false);
  const [newTask, setNewTask] = useState("");

  const [selectedHome, setSelectedHome] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    loadHomes();
    loadTasks();
  }, []);

  /* ================= HOMES ================= */
  const loadHomes = async () => {
    try {
      const data = await AsyncStorage.getItem(HOMES_KEY);

      if (data) {
        setHomes(JSON.parse(data));
      } else {
        const apiData = await getHomes();
        setHomes(apiData);
        await AsyncStorage.setItem(HOMES_KEY, JSON.stringify(apiData));
      }
    } catch (e) {
      console.log("Homes error:", e);
    }
  };

  /* ================= TASKS ================= */
  const loadTasks = async () => {
    try {
      const data = await AsyncStorage.getItem(TASK_KEY);
      if (data) setTasks(JSON.parse(data));
    } catch (e) {
      console.log("Tasks error:", e);
    }
  };

  const saveTasks = async (data) => {
    await AsyncStorage.setItem(TASK_KEY, JSON.stringify(data));
  };

  /* ================= ADD TASK ================= */
  const addTask = async () => {
    if (!newTask.trim() || !selectedHome || !selectedRoom) return;

    const newItem = {
      id: Date.now().toString(),
      title: newTask,
      done: false,

      // 🔥 IMPORTANT: CONTEXT ADDED
      homeId: selectedHome.id,
      homeName: selectedHome.name,
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
    };

    const updated = [...tasks, newItem];
    setTasks(updated);
    await saveTasks(updated);

    setNewTask("");
    setTaskModal(false);
  };

  /* ================= TOGGLE TASK ================= */
  const toggleTask = async (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );

    setTasks(updated);
    await saveTasks(updated);
  };

  const handleLogout = () => setUser(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={s.header}>
          <View style={s.headerTop}>
            <View>
              <Text style={s.greeting}>
                Welcome{"\n"}
                <Text style={{ color: C.orange }}>
                  {user?.name || "User"}
                </Text>
              </Text>

              <View style={s.datePill}>
                <View style={s.dot} />
                <Text style={s.dateText}>{today}</Text>
              </View>
            </View>

            <View style={{ alignItems: "center" }}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </Text>
              </View>

              <TouchableOpacity onPress={handleLogout}>
                <Text style={{ color: "red", marginTop: 6 }}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={s.body}>

          {/* HOMES */}
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>YOUR HOMES</Text>
          </View>

          <FlatList
            data={homes}
            numColumns={2}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 12,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={s.homeCardGrid}
                onPress={() => {
                  setSelectedHome(item);
                  setSelectedRoom(null);

                  navigation.navigate("Rooms", {
                    homeId: item.id,
                    homeName: item.name,
                  });
                }}
              >
                <View style={s.homeIcon}>
                  <Text style={{ fontSize: 18 }}>🏠</Text>
                </View>

                <Text style={s.homeName}>{item.name}</Text>
                <Text style={s.homeRooms}>
                  {item.roomCount ?? 0} rooms
                </Text>
              </TouchableOpacity>
            )}
          />

          <View style={s.divider} />


          

        </View>
      </ScrollView>

    

    </SafeAreaView>
  );
}

/* ================= ONLY ADD THIS STYLE ================= */
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.grayLight },

  header: {
    backgroundColor: C.white,
    padding: 24,
    paddingTop: Platform.OS === "android" ? 24 : 20,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: C.black,
    lineHeight: 34,
  },

  datePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.orangeLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.orange,
  },

  dateText: {
    fontSize: 12,
    color: C.orangeDark,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.orange,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: C.white,
  },

  body: { padding: 20 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 12,
    letterSpacing: 1,
    color: C.gray,
  },

  homeCardGrid: {
    width: "48%",
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
  },

  homeIcon: {
    width: 38,
    height: 38,
    backgroundColor: C.orangeMid,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  homeName: { fontWeight: "600" },

  homeRooms: { fontSize: 12, color: C.gray },

  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 24,
  },

  taskCount: { fontSize: 12, color: C.gray },

  emptyTasks: { alignItems: "center", paddingVertical: 32 },

  emptyText: { color: C.gray },

  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },

  taskText: { flex: 1 },

  taskTextDone: { textDecorationLine: "line-through" },

  taskMeta: {
    fontSize: 11,
    color: C.gray,
    marginTop: 2,
  },

  taskCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: C.border,
    marginRight: 10,
  },

  taskCheckDone: {
    backgroundColor: C.orange,
  },

  checkMark: { color: C.white },

  taskTag: {
    backgroundColor: C.orangeLight,
    paddingHorizontal: 8,
    borderRadius: 20,
  },

  addTaskBtn: {
    backgroundColor: C.orange,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  addTaskText: { color: C.white },
});