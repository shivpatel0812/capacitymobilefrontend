// src/Components/AFC.js
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

// Replace these images with your actual paths
import BasketballImage from "../../assets/basketball.jpg";
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

        // Ensure we find the 'afccapacity' block
        if (
          finalResponse &&
          finalResponse.data &&
          finalResponse.data.afccapacity
        ) {
          const capacities = finalResponse.data.afccapacity;
          const maxCapacity = 1000; // your chosen max

          // Only these 3
          const floorMapping = [
            {
              key: "basketball",
              name: "Basketball Court",
              image: BasketballImage,
            },
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

  // Custom progress bar
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
      {/* Make the notch area / status bar bright on iOS */}
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
                // Calculate ratio/percentage
                const ratio = floor.capacity / floor.total;
                const safeRatio = Math.max(Math.min(ratio, 1), 0);
                const percentage = (safeRatio * 100).toFixed(0);

                return (
                  <View key={floor.id} style={styles.floorCard}>
                    {/* Full-width image at top */}
                    <Image source={floor.image} style={styles.floorImage} />

                    {/* Info below image */}
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

// =========== STYLES ============
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#E57200", // orange top
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
  // White content area
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
  // Each floor card => looks like your library capacity card
  floorCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    marginBottom: 16,
    overflow: "hidden",
  },
  // Full-width top image
  floorImage: {
    width: "100%",
    height: 220, // bigger image
    resizeMode: "cover",
  },
  // Info area under the image
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
  // Progress bar
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
  // Error text
  errorMessage: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    marginTop: 20,
  },
});
