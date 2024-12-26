import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

function CapacityData() {
  const [capacities, setCapacities] = useState({});
  const navigation = useNavigation(); // Access navigation

  useEffect(() => {
    const fetchLatestCapacities = async () => {
      try {
        const response = await fetch(
          "http://192.168.115.153:3001/api/latest-capacities"
        );
        const data = await response.json();

        // Format data to ensure we always have numeric values
        const formattedCapacities = {
          "Rice Hall": {
            current: data.data.ricehall?.current_capacity || 0,
            total: 400,
          },
          "Clemons Library": {
            current: data.data.clemonslibrary?.capacity?.final_capacity || 0,
            total: 2000,
          },
          "Shannon Library": {
            current: data.data.shannon?.capacity?.final_capacity || 0,
            total: 2000,
          },
        };

        setCapacities(formattedCapacities);
      } catch (error) {
        console.error("Error fetching capacities:", error);
      }
    };

    fetchLatestCapacities();
  }, []);

  const locations = [
    {
      name: "Clemons Library",
      image: "https://example.com/clemons.jpg",
      totalCapacity: 2000,
    },
    {
      name: "Shannon Library",
      image: "https://example.com/shannon.jpg",
      totalCapacity: 2000,
    },
    {
      name: "Rice Hall",
      image: "https://example.com/ricehall.jpg",
      totalCapacity: 400,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Capacity at UVA</Text>
      {locations.map((location, index) => {
        const currentCapacity = capacities[location.name]?.current ?? 0;
        const totalCapacity =
          capacities[location.name]?.total ?? location.totalCapacity;

        // Safely compute ratio
        // 1) Avoid dividing by zero
        // 2) Clamp between 0 and 1
        const rawRatio =
          totalCapacity > 0 ? currentCapacity / totalCapacity : 0;
        const safeRatio = Math.max(Math.min(rawRatio, 1), 0);
        // Convert to a float with up to 2 decimals
        const progress = parseFloat(safeRatio.toFixed(2));

        return (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => {
              if (location.name === "Clemons Library") {
                navigation.navigate("Clemons");
              } else if (location.name === "Shannon Library") {
                navigation.navigate("Shannon");
              }
              // Rice Hall doesn’t navigate anywhere in this example
            }}
          >
            <Image source={{ uri: location.image }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{location.name}</Text>
              <Text style={styles.capacityText}>
                {currentCapacity}/{totalCapacity} (
                {(safeRatio * 100).toFixed(0)}%)
              </Text>
              <ProgressBar
                progress={progress}
                color="#0056D2"
                style={styles.progressBar}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#f5faff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#232d4b",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#232d4b",
  },
  capacityText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
  },
});

export default CapacityData;
