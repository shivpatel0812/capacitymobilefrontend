import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import ClemonsImage from "../../assets/Clemons-location.png";
import ShannonImage from "../../assets/2f984490-663c-4515-b7e0-03acbfb328f2.sized-1000x1000.jpg";
import RiceHallImage from "../../assets/ricehall.png";
import AfcImage from "../../assets/Fitness Facilities.jpg";
import OneCamRaTestImage from "../../assets/OneCamRaTest.jpg";

function CapacityData() {
  const [capacities, setCapacities] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLatestCapacities = async () => {
      try {
        const apiUrl =
          "https://ykfoxx9h9a.execute-api.us-east-2.amazonaws.com/reactdeploy/nodemongo";
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(
            `HTTP Error: ${response.status} ${response.statusText}`
          );
        }

        const parsed = await response.json();
        const finalResponse = parsed.body ? JSON.parse(parsed.body) : parsed;
        const { data } = finalResponse || {};
        if (!data) {
          throw new Error("Unexpected API structure: missing 'data' field.");
        }

        const { ricehall, clemonslibrary, shannon, onecameratest } = data;

        const formattedCapacities = {
          Clemons: {
            current: clemonslibrary?.calculated_capacities?.total_capacity ?? 0,
            total: 2000,
          },
          Shannon: {
            current: shannon?.total_capacity ?? 0,
            total: 2000,
          },
          "Rice Hall": {
            current: ricehall?.total_capacity ?? 0,
            total: 400,
          },
          AFC: {
            current: 0, // Not in API
            total: 1000,
          },
          OneCamRaTest: {
            current: onecameratest?.total_capacity ?? 0,
            total: 500,
          },
        };

        setCapacities(formattedCapacities);
      } catch (err) {
        setErrorMessage("Failed to fetch capacities.");
        console.error("Error fetching capacities:", err);
      }
    };

    fetchLatestCapacities();
  }, []);

  const locations = [
    { name: "Clemons", image: ClemonsImage, totalCapacity: 2000 },
    { name: "Shannon", image: ShannonImage, totalCapacity: 2000 },
    { name: "Rice Hall", image: RiceHallImage, totalCapacity: 400 },
    { name: "AFC", image: AfcImage, totalCapacity: 1000 },
    { name: "OneCamRaTest", image: OneCamRaTestImage, totalCapacity: 500 },
  ];

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.orangeHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>&larr;</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Capacity Areas</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Clemons, Shannon, AFC..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.contentArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : (
            filteredLocations.map((loc, index) => {
              const currentCap = capacities[loc.name]?.current ?? 0;
              const totalCap = capacities[loc.name]?.total ?? loc.totalCapacity;
              const ratio = totalCap > 0 ? currentCap / totalCap : 0;
              const percentage = Math.min(Math.max(ratio, 0), 1) * 100;

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.card}
                  onPress={() => {
                    if (loc.name !== "Shannon") {
                      navigation.navigate(loc.name);
                    }
                  }}
                >
                  <Image source={loc.image} style={styles.cardImage} />
                  <View style={styles.cardInfo}>
                    <Text style={styles.locationName}>{loc.name}</Text>
                    <Text style={styles.capacityText}>
                      {currentCap}/{totalCap} ({percentage.toFixed(0)}%)
                    </Text>
                    <View style={styles.progressContainer}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${percentage}%` },
                        ]}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default CapacityData;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E57200",
  },
  orangeHeader: {
    backgroundColor: "#E57200",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 20 : 10,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backButton: {
    marginRight: 8,
  },
  backArrow: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  searchContainer: {
    width: "100%",
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    borderColor: "#FFFFFF",
    borderWidth: 1.5,
    color: "#232D4B",
  },
  contentArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -10,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    marginBottom: 16,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#232D4B",
    marginBottom: 4,
  },
  capacityText: {
    fontSize: 16,
    color: "#232D4B",
    marginBottom: 8,
  },
  progressContainer: {
    width: "100%",
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E0E0E0",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#E57200",
  },
});
