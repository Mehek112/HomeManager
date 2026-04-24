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

import { getHomes } from "../services/api";

const C = {
  orange: "#F26419",
  orangeLight: "#FFF0E8",
  orangeMid: "#FDDCCA",
  orangeDark: "#C04A0C",
  black: "#1A1208",
  gray: "#7A6E64",
  grayLight: "#F5F2EE",
  white: "#FFFFFF",
  border: "#E8E0D8",
};

export default function DashboardScreen({ navigation, user, setUser }) {
  const [homes, setHomes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskModal, setTaskModal] = useState(false);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    loadHomes();
  }, []);

  const loadHomes = async () => {
    const data = await getHomes();
    setHomes(data);
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newTask,
        done: false,
      },
    ]);

    setNewTask("");
    setTaskModal(false);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const handleLogout = () => {
    setUser(null);
  };

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

          {/* HOMES HEADER */}
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>YOUR HOMES</Text>

            {/* ✅ FIXED NAVIGATION */}
            <TouchableOpacity
              onPress={() => navigation.navigate("HomeList")}
            >
              <Text style={s.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>

          {/* HOMES GRID */}
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
                onPress={() =>
                  navigation.navigate("Rooms", {
                    homeId: item.id,
                    homeName: item.name,
                  })
                }
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

          {/* TASKS */}
          <View style={[s.sectionHeader, { marginTop: 4 }]}>
            <Text style={s.sectionTitle}>TODAY'S TASKS</Text>
            <Text style={s.taskCount}>{tasks.length} tasks</Text>
          </View>

          {tasks.length === 0 ? (
            <View style={s.emptyTasks}>
              <Text style={s.emptyText}>
                No tasks yet — enjoy your day!
              </Text>
            </View>
          ) : (
            tasks.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={s.taskItem}
                onPress={() => toggleTask(item.id)}
              >
                <View
                  style={[
                    s.taskCheck,
                    item.done && s.taskCheckDone,
                  ]}
                >
                  {item.done && (
                    <Text style={s.checkMark}>✓</Text>
                  )}
                </View>

                <Text
                  style={[
                    s.taskText,
                    item.done && s.taskTextDone,
                  ]}
                >
                  {item.title}
                </Text>

                <View style={s.taskTag}>
                  <Text style={s.taskTagText}>Home</Text>
                </View>
              </TouchableOpacity>
            ))
          )}

          <TouchableOpacity
            style={s.addTaskBtn}
            onPress={() => setTaskModal(true)}
          >
            <Text style={s.addTaskText}>+ Add Task</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={taskModal} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.sheet}>

            <Text style={s.sheetTitle}>New Task</Text>

            <TextInput
              style={s.input}
              value={newTask}
              onChangeText={setNewTask}
              placeholder="What needs to be done?"
              placeholderTextColor={C.gray}
              autoFocus
              onSubmitEditing={addTask}
            />

            <View style={s.sheetActions}>
              <TouchableOpacity
                style={s.btnCancel}
                onPress={() => setTaskModal(false)}
              >
                <Text style={s.btnCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={s.btnSave}
                onPress={addTask}
              >
                <Text style={s.btnSaveText}>Save Task</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

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

  body: {
    padding: 20,
  },

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

  seeAll: {
    color: C.orange,
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

  homeName: {
    fontWeight: "600",
  },

  homeRooms: {
    fontSize: 12,
    color: C.gray,
  },

  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 24,
  },

  taskCount: {
    fontSize: 12,
    color: C.gray,
  },

  emptyTasks: {
    alignItems: "center",
    paddingVertical: 32,
  },

  emptyText: {
    color: C.gray,
  },

  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },

  taskText: {
    flex: 1,
  },

  taskTextDone: {
    textDecorationLine: "line-through",
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

  checkMark: {
    color: C.white,
  },

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

  addTaskText: {
    color: C.white,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    backgroundColor: C.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
});