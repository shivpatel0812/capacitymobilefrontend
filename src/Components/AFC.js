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

import Floor1Image from "../../assets/afc2.jpg";
import Floor2Image from "../../assets/afc2.jpg";

export default function AFC() {
  const [floors, setFloors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAfcData = async () => {
      try {
        const response = await fetch(
          "https://ykfoxx9h9a.execute-api.us-east-2.amazonaws.com/reactdeploy/nodemongo"
        );
        const result = await response.json();
        const finalResponse = result.body ? JSON.parse(result.body) : result;

        if (
          finalResponse &&
          finalResponse.data &&
          finalResponse.data.afccapacity
        ) {
          const capacities = finalResponse.data.afccapacity;
          const maxCapacity = 1000;

          // Basketball is removed—only first_floor and second_floor remain
          const floorMapping = [
            { key: "first_floor", name: "First Floor", image: Floor1Image },
            { key: "second_floor", name: "Second Floor", image: Floor2Image },
          ];

          const formattedFloors = floorMapping.map((f) => ({
            id: f.key,
            name: f.name,
            image: f.image,
            capacity: capacities[f.key] || 0,
            total: maxCapacity,
          }));

          setFloors(formattedFloors);
        } else {
          setErrorMessage("No AFC floor data found in API response.");
        }
      } catch (error) {
        console.error("Error fetching AFC data:", error);
        setErrorMessage("Error fetching AFC data.");
      }
    };

    fetchAfcData();
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
          <Text style={styles.headerTitle}>AFC Gym</Text>
        </View>

        <View style={styles.contentContainer}>
          <ScrollView contentContainerStyle={styles.scrollInner}>
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : (
              floors.map((floor) => {
                const ratio = floor.capacity / floor.total;
                const safeRatio = Math.max(Math.min(ratio, 1), 0);
                const percentage = (safeRatio * 100).toFixed(0);

                return (
                  <View key={floor.id} style={styles.floorCard}>
                    <Image source={floor.image} style={styles.floorImage} />
                    <View style={styles.cardInfo}>
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
  floorCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    marginBottom: 16,
    overflow: "hidden",
  },
  floorImage: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },
  cardInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  floorName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#232D4B",
    marginBottom: 6,
  },
  capacityText: {
    fontSize: 16,
    color: "#232D4B",
    marginBottom: 10,
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
  errorMessage: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    marginTop: 20,
  },
});
