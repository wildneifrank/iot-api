import admin from "firebase-admin";
import serviceAccount from "secrets/credentials.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://iot-project-f64ad-default-rtdb.firebaseio.com",
});

export const db = admin.database();
export const auth = admin.auth();

const testConnection = async () => {
  const ref = db.ref("/");
  ref
    .once("value")
    .then((snapshot) => {
      const data = snapshot.val(); // Get the data from the snapshot
      if (data) {
        const numberOfEntries = Object.keys(data.sensors.data).length; // Count the keys in the data object
        console.log("Number of entries:", numberOfEntries);
      } else {
        console.log("No data available.");
      }
    })
    .catch((error) => {
      console.error("Connection failed:", error);
    });
};

testConnection();
