import coap from "coap";
import { db } from "database/db";

const tempMeasurements: number[] = [];
const bpmMeasurements: number[] = [];

// interfaces
interface ISensorData {
  temperature: number;
  ageGroup: string;
  sex: string;
  timestamp: string;
  bpm: number;
}

// CoAP server setup
const coapServer = coap.createServer((req, res) => {
  console.log(`Received request for ${req.url} with method ${req.method}`);

  if (req.method === "POST") {
    try {
      // Parse CoAP payload
      const payload = JSON.parse(req.payload.toString());
      const { path, data } = payload as { path: string; data: ISensorData };

      console.log("Parsed Payload:", payload);

      if (!path || !data) {
        res.setOption("Content-Format", "application/json");
        res.end(
          JSON.stringify({ status: "error", message: "Invalid payload" })
        );
        return;
      }

      const temperature = data.temperature;
      const bpm = data.bpm;

      if (isNaN(temperature) || isNaN(bpm)) {
        res.setOption("Content-Format", "application/json");
        res.end(
          JSON.stringify({
            status: "error",
            message: "Invalid temperature or bpm value",
          })
        );
        return;
      }

      if (tempMeasurements.length >= 5) {
        tempMeasurements.shift(); // Remove the oldest
      }
      tempMeasurements.push(temperature); // Add the new temperature

      // Update bpm measurements
      if (bpmMeasurements.length >= 5) {
        bpmMeasurements.shift(); // Remove the oldest
      }
      bpmMeasurements.push(bpm); // Add the new bpm

      console.log("Updated Temperature Measurements:", tempMeasurements);
      console.log("Updated BPM Measurements:", bpmMeasurements);

      // Calculate averages
      const tempAverage = Number(
        (
          tempMeasurements.reduce((sum, temp) => sum + temp, 0) /
          tempMeasurements.length
        ).toFixed(2)
      );

      const bpmAverage = Math.round(
        bpmMeasurements.reduce((sum, rate) => sum + rate, 0) /
          bpmMeasurements.length
      );

      console.log(`Current Temperature Average: ${tempAverage}°C`);
      console.log(`Current BPM Average: ${bpmAverage}`);

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
          // Save the temperature and bpm data to Firebase
          const sensorPath = `sensors/data`;
          const ref = db.ref(sensorPath);
          const formattedTimestamp = new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
            timeZone: "America/Sao_Paulo",
          }).format(new Date());

          const sensorData: ISensorData = {
            temperature: tempAverage,
            sex: data.sex,
            ageGroup: data.ageGroup,
            timestamp: formattedTimestamp,
            bpm: bpmAverage,
          };

          if (bpmAverage > 50) {
            sensorData.bpm = bpmAverage;
            await ref.push(sensorData);
            console.log("Data saved to Firebase:", {
              temperature,
              bpm,
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
