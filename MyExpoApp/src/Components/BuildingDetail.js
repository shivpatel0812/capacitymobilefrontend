// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
// import { ProgressBar } from "react-native-paper"; // For the progress bar

// function LocationBox({ name, image, capacity, totalCapacity }) {
//   const percentage = (capacity / totalCapacity) * 100;

//   return (
//     <View style={styles.card}>
//       <Image source={{ uri: image }} style={styles.image} />
//       <View style={styles.infoContainer}>
//         <Text style={styles.name}>{name}</Text>
//         <Text style={styles.capacityText}>
//           {capacity}/{totalCapacity} ({percentage.toFixed(0)}%)
//         </Text>
//         <ProgressBar
//           progress={capacity / totalCapacity}
//           color="#0056D2"
//           style={styles.progressBar}
//         />
//       </View>
//     </View>
//   );
// }

// function CapacityData() {
//   const [capacities, setCapacities] = useState({});

//   useEffect(() => {
//     const fetchLatestCapacity = async () => {
//       try {
//         const response = await fetch(
//           "http://192.168.115.153:3000/api/latest-capacity"
//         );
//         const data = await response.json();

//         setCapacities({
//           "Darsh Room": {
//             current: data.current_capacity || 0,
//             total: 400,
//           },
//           "Clemons Library": { current: 1240, total: 2000 },
//           "Shannon Library": { current: 48, total: 2000 },
//           "Rice Hall": { current: 18, total: 400 },
//           "AFC Gym": { current: 300, total: 400 },
//         });
//       } catch (error) {
//         console.error("Error fetching capacities:", error);
//       }
//     };

//     fetchLatestCapacity();
//   }, []);

//   const locations = [
//     {
//       name: "Clemons Library",
//       image: "https://example.com/clemons.jpg",
//       totalCapacity: 2000,
//     },
//     {
//       name: "Shannon Library",
//       image: "https://example.com/shannon.jpg",
//       totalCapacity: 2000,
//     },
//     {
//       name: "Rice Hall",
//       image: "https://example.com/ricehall.jpg",
//       totalCapacity: 400,
//     },
//     {
//       name: "AFC Gym",
//       image: "https://example.com/afcgym.jpg",
//       totalCapacity: 400,
//     },
//     {
//       name: "Darsh Room",
//       image: "https://example.com/darshroom.jpg",
//       totalCapacity: 400,
//     },
//   ];

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Capacity at UVA</Text>
//       {locations.map((location, index) => (
//         <LocationBox
//           key={index}
//           name={location.name}
//           image={location.image}
//           capacity={capacities[location.name]?.current || 0}
//           totalCapacity={location.totalCapacity}
//         />
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 20,
//     paddingHorizontal: 10,
//     backgroundColor: "#f5faff",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#232d4b",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ffffff",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   image: {
//     width: 60,
//     height: 60,
//     borderRadius: 10,
//     marginRight: 15,
//   },
//   infoContainer: {
//     flex: 1,
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#232d4b",
//   },
//   capacityText: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 8,
//   },
//   progressBar: {
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#e0e0e0",
//   },
// });

// export default CapacityData;
