// const { MongoClient } = require("mongodb");
// const uri = "mongodb+srv://shivpatelva:RqixH8VCKsKivu4R@capuva.ub0uj.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri);
// let dbPromise = null;

// async function connectToDatabase() {
//   if (!dbPromise) {
//     dbPromise = client.connect().then(() => client.db("CAPUVA"));
//   }
//   return dbPromise;
// }

// exports.handler = async (event) => {
//   if (event.httpMethod === "OPTIONS") {
//     return {
//       statusCode: 200,
//       headers: {
//         "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "http://localhost:8081",
//         "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//         "Access-Control-Allow-Headers": "Content-Type, Authorization"
//       },
//       body: JSON.stringify({ message: "CORS preflight response" })
//     };
//   }

//   try {
//     const database = await connectToDatabase();

//     let ricehallData = null;
//     let clemonsData = null;
//     let shannonData = null;
//     let oneCameraTestData = null;
//     let afccapacityData = null;
//     let afctestData = null;

//     try {
//       const ricehallResult = await database
//         .collection("ricehall")
//         .find({})
//         .sort({ _id: -1 })
//         .limit(1)
//         .toArray();
//       if (ricehallResult.length > 0) {
//         ricehallData = {
//           total_capacity: ricehallResult[0].total_capacity ?? null
//         };
//       }
//     } catch (error) {
//       console.error("Error fetching Rice Hall data:", error);
//     }

//     try {
//       [clemonsData] = await database
//         .collection("clemonslibrary")
//         .find({})
//         .sort({ _id: -1 })
//         .limit(1)
//         .toArray();
//     } catch (error) {
//       console.error("Error fetching Clemons Library data:", error);
//     }

//     try {
//       const shannonResult = await database
//         .collection("shannon")
//         .find({})
//         .sort({ _id: -1 })
//         .limit(1)
//         .toArray();
//       if (shannonResult.length > 0) {
//         shannonData = {
//           total_capacity: shannonResult[0].total_capacity ?? null
//         };
//       }
//     } catch (error) {
//       console.error("Error fetching Shannon data:", error);
//     }

//     try {
//       const oneCameraTestResult = await database
//         .collection("onecameratest")
//         .find({})
//         .sort({ _id: -1 })
//         .limit(1)
//         .toArray();
//       if (oneCameraTestResult.length > 0) {
//         oneCameraTestData = {
//           total_capacity: oneCameraTestResult[0].total_capacity ?? null,
//           updated_at: oneCameraTestResult[0].updated_at ?? null
//         };
//       }
//     } catch (error) {
//       console.error("Error fetching oneCameraTest data:", error);
//     }

//     try {
//       const occupancyDoc = await database
//         .collection("afccapacity")
//         .findOne({ _id: "occupancy" });
//       if (occupancyDoc) {
//         afccapacityData = {
//           basketball: occupancyDoc.basketball ?? 0,
//           basketball_prev: occupancyDoc.basketball_prev ?? 0,
//           entrance: occupancyDoc.entrance ?? 0,
//           first_floor: occupancyDoc.first_floor ?? 0,
//           second_floor: occupancyDoc.second_floor ?? 0,
//           last_updated: occupancyDoc.last_updated ?? null
//         };
//       }
//     } catch (error) {
//       console.error("Error fetching AFC capacity data:", error);
//     }

//     try {
//       afctestData = await database
//         .collection("afctest")
//         .findOne({ _id: "capacity" });
//     } catch (error) {
//       console.error("Error fetching AFC test capacity data:", error);
//     }

//     const result = {
//       ricehall: ricehallData,
//       clemonslibrary: clemonsData,
//       shannon: shannonData,
//       onecameratest: oneCameraTestData,
//       afccapacity: afccapacityData,
//       afctest: afctestData
//     };

//     return {
//       statusCode: 200,
//       headers: {
//         "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "http://localhost:8081",
//         "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//         "Access-Control-Allow-Headers": "Content-Type, Authorization"
//       },
//       body: JSON.stringify({
//         message: "Latest capacities fetched successfully",
//         data: result
//       })
//     };
//   } catch (error) {
//     console.error("Error in main try/catch:", error);
//     return {
//       statusCode: 500,
//       headers: {
//         "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "http://localhost:8081",
//         "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//         "Access-Control-Allow-Headers": "Content-Type, Authorization"
//       },
//       body: JSON.stringify({ error: "Internal Server Error" })
//     };
//   }
// };

const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://shivpatelva:RqixH8VCKsKivu4R@capuva.ub0uj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
let dbPromise = null;

async function connectToDatabase() {
  if (!dbPromise) {
    dbPromise = client.connect().then(() => client.db("CAPUVA"));
  }
  return dbPromise;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "http://localhost:8081",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      },
      body: JSON.stringify({ message: "CORS preflight response" })
    };
  }

  try {
    const database = await connectToDatabase();

    let ricehallData = null;
    let clemonsData = null;
    let shannonData = null;
    let oneCameraTestData = null;
    let afccapacityData = null;
    let afctestData = null;

    try {
      const res = await database
        .collection("ricehall")
        .find({})
        .sort({ _id: -1 })
        .limit(1)
        .toArray();
      if (res.length > 0) {
        ricehallData = {
          total_capacity: res[0].total_capacity ?? null
        };
      }
    } catch (error) {}

    try {
      [clemonsData] = await database
        .collection("clemonslibrary")
        .find({})
        .sort({ _id: -1 })
        .limit(1)
        .toArray();
    } catch (error) {}

    try {
      const res = await database
        .collection("shannon")
        .find({})
        .sort({ _id: -1 })
        .limit(1)
        .toArray();
      if (res.length > 0) {
        shannonData = {
          total_capacity: res[0].total_capacity ?? null
        };
      }
    } catch (error) {}

    try {
      const res = await database
        .collection("onecameratest")
        .find({})
        .sort({ _id: -1 })
        .limit(1)
        .toArray();
      if (res.length > 0) {
        oneCameraTestData = {
          total_capacity: res[0].total_capacity ?? null,
          updated_at: res[0].updated_at ?? null
        };
      }
    } catch (error) {}

    try {
      const latest = await database
        .collection("afccapacity")
        .find({})
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray();

      if (latest.length > 0) {
        afccapacityData = latest[0];
      }
    } catch (error) {}

    try {
      afctestData = await database
        .collection("afctest")
        .findOne({ _id: "capacity" });
    } catch (error) {}

    const result = {
      ricehall: ricehallData,
      clemonslibrary: clemonsData,
      shannon: shannonData,
      onecameratest: oneCameraTestData,
      afccapacity: afccapacityData,
      afctest: afctestData
    };

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "http://localhost:8081",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      },
      body: JSON.stringify({
        message: "Latest capacities fetched successfully",
        data: result
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "http://localhost:8081",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      },
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};
