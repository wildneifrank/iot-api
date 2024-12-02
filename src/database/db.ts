import admin from "firebase-admin";
import serviceAccount from "secrets/credentials.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://iot-project-f64ad-default-rtdb.firebaseio.com",
});

export const db = admin.database();

const testConnection = async () => {
  const ref = db.ref("/");
  ref
    .once("value")
    .then((snapshot) => {
      console.log("Connected successfully. Data:", snapshot.val());
    })
    .catch((error) => {
      console.error("Connection failed:", error);
    });
};

testConnection();
