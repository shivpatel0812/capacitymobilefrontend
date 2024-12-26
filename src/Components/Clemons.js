import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { ProgressBar } from "react-native-paper";

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
          "http://192.168.115.153:3001/api/latest-capacities"
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
            floor_1: "https://example.com/floor1.jpg",
            floor_2: "https://example.com/floor2.jpg",
            floor_3: "https://example.com/floor3.jpg",
            floor_4: "https://example.com/floor4.jpg",
          };

          const formattedFloors = Object.entries(floorResults).map(
            ([floorKey, capacity], index) => {
              const floorNumber = floorKey.split("_")[1]; // Example: "floor_1" -> "1"
              const floorName = `Floor ${floorNumber}`;
              const floorImage =
                floorImageMap[floorKey] || "https://example.com/default.jpg";

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Clemons Library</Text>

      {/* Open Hours Section */}
      <View style={styles.hoursContainer}>
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

      {/* Floor Capacity Section */}
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : (
        floors.map((floor) => (
          <View key={floor.id} style={styles.card}>
            <Image source={{ uri: floor.image }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{floor.name}</Text>
              <Text style={styles.capacityText}>
                {floor.capacity}/{floor.total} (
                {((floor.capacity / floor.total) * 100).toFixed(0)}%)
              </Text>
              <ProgressBar
                progress={floor.capacity / floor.total}
                color="#0056D2"
                style={styles.progressBar}
              />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f5faff" },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  hoursContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  hoursTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
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
    fontWeight: "bold",
    color: "#232d4b",
  },
  hoursText: {
    fontSize: 16,
    color: "#555",
  },
  errorMessage: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    marginVertical: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  infoContainer: { flex: 1 },
  name: { fontSize: 18, fontWeight: "bold" },
  capacityText: { color: "#555" },
  progressBar: { height: 8, marginTop: 5 },
});
