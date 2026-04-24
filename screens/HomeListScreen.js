import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  SafeAreaView,
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

export default function HomeListScreen({ navigation }) {
  const [homes, setHomes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newHome, setNewHome] = useState("");

  useEffect(() => {
    loadHomes();
  }, []);

  const loadHomes = async () => {
    const data = await getHomes();
    setHomes(data);
  };

  const addHome = () => {
    if (!newHome.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      name: newHome,
    };

    setHomes((prev) => [...prev, newItem]);
    setNewHome("");
    setModalVisible(false);
  };

  // 🔥 add button inside grid
  const homeData = [
    ...homes,
    { id: "add-home", isAdd: true }
  ];

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>

        {/* HEADER WITH BACK BUTTON */}
        <View style={s.headerRow}>

  <TouchableOpacity
    onPress={() =>
      navigation.reset({
        index: 0,
        routes: [{ name: "Dashboard" }],
      })
    }
  >
    <Text style={s.backBtn}>← Back</Text>
  </TouchableOpacity>

  <Text style={s.title}>Rooms</Text>

  <View style={{ width: 60 }} />
</View>

        {/* Grid */}
        <FlatList
          data={homeData}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 12,
          }}
          renderItem={({ item }) => {

            // ➕ Add Card
            if (item.isAdd) {
              return (
                <TouchableOpacity
                  style={s.addCard}
                  onPress={() => setModalVisible(true)}
                >
                  <View style={s.addIcon}>
                    <Text style={s.addIconText}>+</Text>
                  </View>
                  <Text style={s.addText}>Add Household</Text>
                </TouchableOpacity>
              );
            }

            // 🏠 Home Card
            return (
              <TouchableOpacity
                style={s.homeCard}
                onPress={() =>
                  navigation.navigate("Rooms", { homeId: item.id })
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
            );
          }}
        />
      </View>

      {/* 🔥 Bottom Sheet Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.sheet}>
            <View style={s.handle} />

            <Text style={s.sheetTitle}>Add New Household</Text>

            <TextInput
              style={s.input}
              value={newHome}
              onChangeText={setNewHome}
              placeholder="Enter home name"
              placeholderTextColor={C.gray}
              autoFocus
              onSubmitEditing={addHome}
            />

            <View style={s.actions}>
              <TouchableOpacity
                style={s.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.saveBtn} onPress={addHome}>
                <Text style={s.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.grayLight },

  container: { padding: 20 },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: C.black,
    marginBottom: 16,
  },

  // 🏠 Home Card
  homeCard: {
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
    fontSize: 14,
    fontWeight: "600",
    color: C.black,
  },

  homeRooms: {
    fontSize: 12,
    color: C.gray,
  },

  // ➕ Add Card
  addCard: {
    width: "48%",
    backgroundColor: C.orangeLight,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.orangeMid,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },

  addIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  addIconText: {
    fontSize: 22,
    color: C.orange,
  },

  addText: {
    fontSize: 13,
    fontWeight: "500",
    color: C.orangeDark,
  },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(26,18,8,0.5)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: C.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.black,
    marginBottom: 12,
  },

  input: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: C.grayLight,
    marginBottom: 12,
    color: C.black,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: C.grayLight,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  cancelText: {
    color: C.gray,
  },

  saveBtn: {
    flex: 2,
    backgroundColor: C.orange,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  saveText: {
    color: C.white,
    fontWeight: "600",
  },
});