import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import HoopImage from "../../assets/basketball.jpg";

export default function HoopCapacity() {
  const navigation = useNavigation();

  // hide the default header to avoid double arrows
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [hoopCap, setHoopCap] = useState(0);
  const totalCap = 200;
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHoop() {
      try {
        const res = await fetch(
          "https://ykfoxx9h9a.execute-api.us-east-2.amazonaws.com/reactdeploy/nodemongo"
        );
        const json = await res.json();
        const body = json.body ? JSON.parse(json.body) : json;
        const hoop = body.data.afctest?.last_hoop_capacity;
        setHoopCap(typeof hoop === "number" ? hoop : 0);
      } catch (e) {
        console.warn(e);
        setError("Error loading hoop data.");
      }
    }
    fetchHoop();
  }, []);

  const ProgressBar = ({ progress }) => {
    const pct = Math.max(0, Math.min(1, progress));
    return (
      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${pct * 100}%` }]} />
      </View>
    );
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const percentage = ((hoopCap / totalCap) * 100).toFixed(0);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>&larr;</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AFC</Text>
      </View>

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.card}>
            <Image source={HoopImage} style={styles.image} />
            <Text style={styles.title}>Basketball Court</Text>
            <Text style={styles.capacity}>
              {hoopCap}/{totalCap} ({percentage}%)
            </Text>
            <ProgressBar progress={hoopCap / totalCap} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#E57200" },
  header: {
    backgroundColor: "#E57200",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 40 : 20,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  backArrow: {
    fontSize: 28,
    color: "#FFFFFF",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  safe: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  scroll: { padding: 16 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 2,
  },
  image: { width: "100%", height: 180, resizeMode: "cover" },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#232D4B",
    margin: 12,
  },
  capacity: {
    fontSize: 16,
    color: "#232D4B",
    marginHorizontal: 12,
    marginBottom: 8,
  },
  barContainer: {
    height: 12,
    backgroundColor: "#EEE",
    borderRadius: 6,
    marginHorizontal: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: "#FFF" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: "red", fontSize: 16 },
});
