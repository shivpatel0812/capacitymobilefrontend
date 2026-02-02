import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

import Clem1 from "../../assets/clem1.jpg";
import Clem2 from "../../assets/clem2.png";
import Clem3 from "../../assets/clem3.jpg";
import Clem4 from "../../assets/clem4.png";

export default function Clemons() {
  const [floors, setFloors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const openHours = [
    { day: "Mon", hours: "8:00 AM - 12:00 AM" },
    { day: "Tue", hours: "8:00 AM - 12:00 AM" },
    { day: "Wed", hours: "8:00 AM - 12:00 AM" },
    { day: "Thu", hours: "8:00 AM - 12:00 AM" },
    { day: "Fri", hours: "8:00 AM - 9:00 PM" },
    { day: "Sat", hours: "9:00 AM - 9:00 PM" },
    { day: "Sun", hours: "9:00 AM - 11:00 PM" },
  ];

  useEffect(() => {
    const fetchFloorData = async () => {
      try {
        const response = await fetch(
          "http://172.16.102.44:3001/api/latest-capacities"
        );
        const result = await response.json();

        if (
          result &&
          result.data &&
          result.data.clemonslibrary &&
          result.data.clemonslibrary.capacity &&
          result.data.clemonslibrary.capacity.floor_results
        ) {
          const floorResults =
            result.data.clemonslibrary.capacity.floor_results;
          const maxCapacityPerFloor = 100;

          const floorImageMap = {
            floor_1: Clem1,
            floor_2: Clem2,
            floor_3: Clem3,
            floor_4: Clem4,
          };

          const formattedFloors = Object.entries(floorResults).map(
            ([floorKey, capacity], index) => {
              const floorNumber = floorKey.split("_")[1];
              const floorName = `Floor ${floorNumber}`;
              const floorImage =
                floorImageMap[floorKey] ||
                require("../../assets/Clemons-location.png");

              return {
                id: index + 1,
                name: floorName,
                image: floorImage,
                capacity,
                total: maxCapacityPerFloor,
              };
            }
          );

          setFloors(formattedFloors);
        } else {
          setErrorMessage("Clemons floor results not found in API response.");
        }
      } catch (error) {
        setErrorMessage("Error fetching Clemons data.");
        console.error(error);
      }
    };

    fetchFloorData();
  }, []);

  return (
    <LinearGradient
      // Navy gradient background (UVA style)
      colors={["#232D4B", "#0D1B33"]}
      style={styles.gradient}
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Big, modern UVA-style header text */}
          <Text style={styles.header}>Clemons Library</Text>

          {/* Open Hours Card */}
          <View style={styles.hoursCard}>
            <Text style={styles.hoursTitle}>Open Hours</Text>
            <View style={styles.hoursTable}>
              {openHours.map((day, index) => (
                <View key={index} style={styles.hoursRow}>
                  <Text style={styles.dayText}>{day.day}</Text>
                  <Text style={styles.hoursText}>{day.hours}</Text>
                </View>
              ))}
            </View>
          </View>

          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : (
            floors.map((floor) => {
              const ratio = floor.capacity / floor.total;
              const safeRatio = Math.max(Math.min(ratio, 1), 0);
              return (
                <View key={floor.id} style={styles.floorCard}>
                  <Image source={floor.image} style={styles.image} />
                  <View style={styles.infoContainer}>
                    <Text style={styles.name}>{floor.name}</Text>
                    <Text style={styles.capacityText}>
                      <Text style={styles.currentCap}>{floor.capacity}</Text>/
                      <Text style={styles.totalCap}>{floor.total}</Text> (
                      <Text style={styles.percent}>
                        {(safeRatio * 100).toFixed(0)}%
                      </Text>
                      )
                    </Text>
                    <ProgressBar
                      progress={safeRatio}
                      color="#E57200" // UVA orange
                      style={styles.progressBar}
                    />
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // Full-screen navy gradient
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  // Container for ScrollView content
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },

  // Big bold UVA-themed header
  header: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },

  // White card for open hours
  hoursCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 15,
    marginBottom: 20,

    // Orange accent on the left
    borderLeftWidth: 8,
    borderLeftColor: "#E57200",

    // Shadow/elevation
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  hoursTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#232D4B",
    textAlign: "center",
    marginBottom: 10,
  },
  hoursTable: {
    flexDirection: "column",
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#232D4B",
  },
  hoursText: {
    fontSize: 16,
    color: "#505050",
  },

  // Error
  errorMessage: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    marginVertical: 20,
  },

  // White card for each floor
  floorCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginBottom: 16,
    borderRadius: 14,
    padding: 15,

    borderLeftWidth: 8,
    borderLeftColor: "#E57200",

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  // Larger images for floors
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#232D4B",
    marginBottom: 6,
  },
  capacityText: {
    fontSize: 16,
    color: "#505050",
    marginBottom: 8,
  },
  currentCap: {
    fontWeight: "700",
    color: "#E57200",
  },
  totalCap: {
    fontWeight: "400",
    color: "#505050",
  },
  percent: {
    fontWeight: "700",
    color: "#232D4B",
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    // Subtle shadow for modern look
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
