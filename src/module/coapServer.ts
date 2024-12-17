import coap from "coap";
import { db } from "database/db";

// Create CoAP server
const coapServer = coap.createServer((req, res) => {
  if (req.method === "POST") {
    try {
      // Parse CoAP payload
      const payload = JSON.parse(req.payload.toString());
      const { path, data } = payload;

      // Save data to Firebase Realtime Database
      const ref = db.ref(path);
      ref
        .set(data)
        .then(() => {
          res.end("Data saved successfully to Firebase");
        })
        .catch((err) => {
          res.end(`Failed to save data: ${err.message}`);
        });
    } catch (error) {
      if (error instanceof Error) {
        res.end(`Invalid payload: ${error.message}`);
      } else {
        res.end(`An unknown error occurred`);
      }
    }
  } else {
    res.end("Unsupported method");
  }
});

// Start CoAP server
const COAP_PORT = 5683; // Standard CoAP port
coapServer.listen(COAP_PORT, () => {
  console.log(`CoAP server is running on udp://localhost:${COAP_PORT}`);
});
