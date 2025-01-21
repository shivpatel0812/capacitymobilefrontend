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
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

// Existing images
import ClemonsImage from "../../assets/Clemons-location.png";
import ShannonImage from "../../assets/2f984490-663c-4515-b7e0-03acbfb328f2.sized-1000x1000.jpg";
import RiceHallImage from "../../assets/ricehall.png";
import AfcImage from "../../assets/Fitness Facilities.jpg"; // Placeholder for AFC Gym

function CapacityData() {
  const [capacities, setCapacities] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLatestCapacities = async () => {
      try {
        const response = await fetch(
          "http://172.16.102.44:3001/api/latest-capacities"
        );
        const data = await response.json();

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
          "AFC Gym": {
            current: data.data.afc?.capacity?.final_capacity || 0,
            total: 1000,
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
      image: ClemonsImage,
      totalCapacity: 2000,
    },
    {
      name: "Shannon Library",
      image: ShannonImage,
      totalCapacity: 2000,
    },
    {
      name: "Rice Hall",
      image: RiceHallImage,
      totalCapacity: 400,
    },
    {
      name: "AFC Gym",
      image: AfcImage,
      totalCapacity: 1000,
    },
  ];

  return (
    <LinearGradient
      colors={["#232D4B", "#0D1B33"]}
      style={styles.gradientContainer}
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Modernized Title */}
          <Text style={styles.title}>Capacity at UVA</Text>

          {locations.map((location, index) => {
            const currentCapacity = capacities[location.name]?.current ?? 0;
            const totalCapacity =
              capacities[location.name]?.total ?? location.totalCapacity;

            const rawRatio =
              totalCapacity > 0 ? currentCapacity / totalCapacity : 0;
            const safeRatio = Math.max(Math.min(rawRatio, 1), 0);

            const progressValue = parseFloat(safeRatio.toFixed(2));

            return (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => {
                  if (location.name === "Clemons Library") {
                    navigation.navigate("Clemons");
                  }
                  // else if (location.name === "Shannon Library") {
                  //   navigation.navigate("Shannon");

                  // }
                }}
              >
                <Image source={location.image} style={styles.image} />
                <View style={styles.infoContainer}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.capacityText}>
                    <Text style={styles.currentCapacity}>
                      {currentCapacity}
                    </Text>
                    /<Text style={styles.totalCapacity}>{totalCapacity}</Text> (
                    <Text style={styles.percentage}>
                      {(safeRatio * 100).toFixed(0)}%
                    </Text>
                    )
                  </Text>
                  <ProgressBar
                    progress={progressValue}
                    color="#E57200" // UVA orange
                    style={styles.progressBar}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Updated styling for modern look
const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 15,
    marginBottom: 16,

    borderLeftWidth: 8,
    borderLeftColor: "#E57200",

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 14,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  locationName: {
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
  currentCapacity: {
    fontWeight: "700",
    color: "#E57200",
  },
  totalCapacity: {
    fontWeight: "400",
    color: "#505050",
  },
  percentage: {
    fontWeight: "700",
    color: "#232D4B",
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default CapacityData;
