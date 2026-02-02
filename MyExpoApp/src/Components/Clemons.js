import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Clem1 from "../../assets/clem1.jpg";
import Clem2 from "../../assets/clem2.png";
import Clem3 from "../../assets/clem3.jpg";
import Clem4 from "../../assets/clem4.png";

export default function Clemons() {
  const [floors, setFloors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const openHours = [
    { day: "Monday", hours: "8:00 AM – 12:00 AM" },
    { day: "Tuesday", hours: "8:00 AM – 12:00 AM" },
    { day: "Wednesday", hours: "8:00 AM – 12:00 AM" },
    { day: "Thursday", hours: "8:00 AM – 12:00 AM" },
    { day: "Friday", hours: "8:00 AM – 9:00 PM" },
    { day: "Saturday", hours: "9:00 AM – 9:00 PM" },
    { day: "Sunday", hours: "9:00 AM – 11:00 PM" },
  ];

  useEffect(() => {
    const fetchFloorData = async () => {
      try {
        const response = await fetch(
          "https://ykfoxx9h9a.execute-api.us-east-2.amazonaws.com/reactdeploy/nodemongo"
        );
        const result = await response.json();
        const finalResponse = result.body ? JSON.parse(result.body) : result;

        if (
          finalResponse &&
          finalResponse.data &&
          finalResponse.data.clemonslibrary &&
          finalResponse.data.clemonslibrary.calculated_capacities
        ) {
          const calculatedCapacities =
            finalResponse.data.clemonslibrary.calculated_capacities;
          const maxCapacityPerFloor = 1000;

          const floorMapping = [
            { key: "camera1", name: "Floor 1", image: Clem1 },
            { key: "camera2_5_joint", name: "Floor 2", image: Clem2 },
            { key: "camera3", name: "Floor 3", image: Clem3 },
            { key: "camera4", name: "Floor 4", image: Clem4 },
          ];

          const formattedFloors = floorMapping.map((floor) => {
            const capacity = calculatedCapacities[floor.key] || 0;
            return {
              id: floor.key,
              name: floor.name,
              image: floor.image,
              capacity,
              total: maxCapacityPerFloor,
            };
          });

          setFloors(formattedFloors);
        } else {
          setErrorMessage("Clemons floor results not found in API response.");
        }
      } catch (error) {
        setErrorMessage("Error fetching Clemons data.");
      }
    };
    fetchFloorData();
  }, []);

  const CustomProgressBar = ({ progress = 0 }) => {
    const clamped = Math.max(Math.min(progress, 1), 0);
    return (
      <View style={styles.progressContainer}>
        <View style={[styles.progressFill, { width: `${clamped * 100}%` }]} />
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Clemons Library</Text>
        </View>

        <View style={styles.contentContainer}>
          <ScrollView contentContainerStyle={styles.scrollInner}>
            <View style={styles.hoursCard}>
              <Text style={styles.hoursTitle}>Open Hours</Text>
              <View style={styles.hoursTable}>
                {openHours.map((dayItem, index) => (
                  <View key={index} style={styles.hoursRow}>
                    <Text style={styles.dayText}>{dayItem.day}</Text>
                    <Text style={styles.hoursText}>{dayItem.hours}</Text>
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
                const percentage = (safeRatio * 100).toFixed(0);

                return (
                  <View key={floor.id} style={styles.floorCard}>
                    <View style={styles.leftBar} />
                    <Image source={floor.image} style={styles.floorImage} />
                    <View style={styles.infoContainer}>
                      <Text style={styles.floorName}>{floor.name}</Text>
                      <Text style={styles.capacityText}>
                        {floor.capacity}/{floor.total} ({percentage}%)
                      </Text>
                      <CustomProgressBar progress={safeRatio} />
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#E57200",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: "#E57200",
    paddingTop: 60,
    paddingBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  scrollInner: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  hoursCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  hoursTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 10,
  },
  hoursTable: {},
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },
  hoursText: {
    fontSize: 16,
    color: "#777777",
  },
  floorCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    marginBottom: 16,
    position: "relative",
    overflow: "hidden",
  },
  leftBar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 8,
    backgroundColor: "#E57200",
  },
  floorImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    marginLeft: 8,
    marginVertical: 8,
    borderRadius: 6,
  },
  infoContainer: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  floorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 6,
  },
  capacityText: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 8,
  },
  progressContainer: {
    height: 10,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#E57200",
  },
  errorMessage: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    marginVertical: 20,
  },
});
