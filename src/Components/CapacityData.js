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

// Images for locations
import ClemonsImage from "../../assets/Clemons-location.png";
import ShannonImage from "../../assets/2f984490-663c-4515-b7e0-03acbfb328f2.sized-1000x1000.jpg";
import RiceHallImage from "../../assets/ricehall.png";
import AfcImage from "../../assets/Fitness Facilities.jpg"; // Placeholder for AFC Gym

function CapacityData() {
  const [capacities, setCapacities] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLatestCapacities = async () => {
      try {
        console.log("Fetching latest capacities...");
        const apiUrl =
          "https://ykfoxx9h9a.execute-api.us-east-2.amazonaws.com/reactdeploy/nodemongo";

        const response = await fetch(apiUrl, { method: "GET" });
        console.log("API Response Status:", response.status);

        if (!response.ok) {
          throw new Error(
            `HTTP Error: ${response.status} ${response.statusText}`
          );
        }

        // Parse the API response
        const parsed = await response.json();
        console.log("Raw API Response:", parsed);

        // Use the actual field names from your API response
        const { clemons_results, shannon_results } = parsed;

        // Build the capacities object based on the API response
        const formattedCapacities = {
          "Clemons Library": {
            current: clemons_results?.capacity?.final_capacity || 0,
            total: 2000,
          },
          "Shannon Library": {
            current: shannon_results?.final_capacity || 0,
            total: 2000,
          },
          "Rice Hall": {
            current: 0, // No data for Rice Hall in the API response
            total: 400,
          },
          "AFC Gym": {
            current: 0, // No data for AFC Gym in the API response
            total: 1000,
          },
        };

        console.log("Formatted Capacities:", formattedCapacities);
        setCapacities(formattedCapacities);
      } catch (error) {
        setErrorMessage("Failed to fetch capacities.");
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
          <Text style={styles.title}>Capacity at UVA</Text>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : (
            locations.map((location, index) => {
              const currentCapacity = capacities[location.name]?.current ?? 0;
              const totalCapacity =
                capacities[location.name]?.total ?? location.totalCapacity;

              const ratio =
                totalCapacity > 0 ? currentCapacity / totalCapacity : 0;
              const clamped = Math.max(Math.min(ratio, 1), 0);
              const progressValue = parseFloat(clamped.toFixed(2));

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.card}
                  onPress={() => {
                    if (location.name === "Clemons Library") {
                      navigation.navigate("Clemons");
                    }
                  }}
                >
                  <Image source={location.image} style={styles.image} />
                  <View style={styles.infoContainer}>
                    <Text style={styles.locationName}>{location.name}</Text>
                    <Text style={styles.capacityText}>
                      <Text style={styles.currentCapacity}>
                        {currentCapacity}
                      </Text>
                      /<Text style={styles.totalCapacity}>{totalCapacity}</Text>{" "}
                      (
                      <Text style={styles.percentage}>
                        {(clamped * 100).toFixed(0)}%
                      </Text>
                      )
                    </Text>
                    <ProgressBar
                      progress={progressValue}
                      color="#E57200"
                      style={styles.progressBar}
                    />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

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
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
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
