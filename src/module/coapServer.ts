import coap from "coap";
import { db } from "database/db";
import { ISensor } from "types/types";

const tempMeasurements: number[] = [];
const heartbeatMeasurements: number[] = [];

// CoAP server setup
const coapServer = coap.createServer((req, res) => {
  console.log(`Received request for ${req.url} with method ${req.method}`);

  if (req.method === "POST") {
    try {
      // Parse CoAP payload
      const payload = JSON.parse(req.payload.toString());
      const { path, data } = payload as { path: string; data: ISensor };

      console.log("Parsed Payload:", payload);

      if (
        !path ||
        !data ||
        typeof data.temperature !== "number" ||
        typeof data.heartbeat !== "number" ||
        typeof data.ageGroup !== "number" ||
        typeof data.sex !== "number"
      ) {
        res.setOption("Content-Format", "application/json");
        res.end(
          JSON.stringify({
            status: "error",
            message: "Invalid or missing data fields",
          })
        );
        return;
      }

      const temperature = data.temperature;
      const heartbeat = data.heartbeat;

      if (isNaN(temperature) || isNaN(heartbeat)) {
        res.setOption("Content-Format", "application/json");
        res.end(
          JSON.stringify({
            status: "error",
            message: "Invalid temperature or heartbeat value",
          })
        );
        return;
      }

      if (tempMeasurements.length >= 5) {
        tempMeasurements.shift(); // Remove the oldest
      }
      tempMeasurements.push(temperature); // Add the new temperature

      // Update heartbeat measurements
      if (heartbeatMeasurements.length >= 5) {
        heartbeatMeasurements.shift(); // Remove the oldest
      }
      heartbeatMeasurements.push(heartbeat); // Add the new heartbeat

      console.log("Updated Temperature Measurements:", tempMeasurements);
      console.log("Updated Heartbeat Measurements:", heartbeatMeasurements);

      // Calculate averages
      const tempAverage = Number(
        (
          tempMeasurements.reduce((sum, temp) => sum + temp, 0) /
          tempMeasurements.length
        ).toFixed(2)
      );

      const heartbeatAverage = Math.round(
        heartbeatMeasurements.reduce((sum, rate) => sum + rate, 0) /
          heartbeatMeasurements.length
      );

      console.log(`Current Temperature Average: ${tempAverage}°C`);
      console.log(`Current Heartbeat Average: ${heartbeatAverage}`);

      // Respond quickly to prevent timeouts
      res.setOption("Content-Format", "application/json");
      res.end(
        JSON.stringify({
          status: "success",
          message: "Request received",
        })
      );

      // Asynchronous processing for Firebase operations
      (async () => {
        try {
          // Save the temperature and heartbeat data to Firebase
          const sensorPath = `sensors/data`;
          const ref = db.ref(sensorPath);
          const timestamp = Math.floor(Date.now() / 1000);

          const sensorData: ISensor = {
            temperature: tempAverage,
            sex: data.sex,
            ageGroup: data.ageGroup,
            timestamp: timestamp,
            heartbeat: heartbeatAverage,
          };

          if (heartbeatAverage > 45) {
            await ref.push(sensorData);
            console.log("Data saved to Firebase:", {
              temperature,
              heartbeat,
            });
          }
        } catch (error) {
          console.error("Error processing data asynchronously:", error);
        }
      })();
    } catch (error) {
      console.error("Error processing request:", error);
      res.setOption("Content-Format", "application/json");
      res.end(
        JSON.stringify({
          status: "error",
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        })
      );
    }
  } else {
    res.setOption("Content-Format", "application/json");
    res.end(JSON.stringify({ status: "error", message: "Unsupported method" }));
  }
});

// Start CoAP server
const COAP_PORT = 5683;
coapServer.listen(COAP_PORT, () => {
  console.log(`CoAP server is running on udp://localhost:${COAP_PORT}`);
});

// Debugging response events
coapServer.on("response", (response) => {
  response.on("error", (err: any) => {
    console.error("Error in CoAP response:", err);
  });

  response.on("timeout", () => {
    console.warn("CoAP response timed out");
  });
});
