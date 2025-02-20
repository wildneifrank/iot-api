import coap from "coap";
import { db } from "database/db";
import { ISensor } from "types/types";

const tempMeasurements: number[] = [];
const heartbeatMeasurements: number[] = [];
const oximetryMeasurements: number[] = [];

// CoAP server setup
const coapServer = coap.createServer((req, res) => {
  console.log(`Received request for ${req.url} with method ${req.method}`);

  if (req.method === "GET") {
    res.setOption("Content-Format", "application/json");
    res.end(
      JSON.stringify({
        status: "success",
        message: "CoAP server is running!",
      })
    );
    return;
  }

  if (req.method === "POST") {
    try {
      // Parse CoAP payload
      const payload = JSON.parse(req.payload.toString());
      const data: ISensor = payload;

      console.log("Parsed Payload:", payload);

      if (
        !data ||
        typeof data.temperature !== "number" ||
        typeof data.heartbeat !== "number" ||
        typeof data.oximetry !== "number" || // Validação adicionada
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
      const oximetry = data.oximetry;

      if (isNaN(temperature) || isNaN(heartbeat) || isNaN(oximetry)) {
        res.setOption("Content-Format", "application/json");
        res.end(
          JSON.stringify({
            status: "error",
            message: "Invalid temperature, heartbeat or oximetry value",
          })
        );
        return;
      }

      // Atualiza medições de temperatura
      if (tempMeasurements.length >= 5) {
        tempMeasurements.shift(); // Remove o mais antigo
      }
      tempMeasurements.push(temperature); // Adiciona o novo valor

      // Atualiza medições de batimentos
      if (heartbeatMeasurements.length >= 5) {
        heartbeatMeasurements.shift();
      }
      heartbeatMeasurements.push(heartbeat);

      // Atualiza medições de oximetria
      if (oximetryMeasurements.length >= 5) {
        oximetryMeasurements.shift();
      }
      oximetryMeasurements.push(oximetry);

      console.log("Updated Temperature Measurements:", tempMeasurements);
      console.log("Updated Heartbeat Measurements:", heartbeatMeasurements);
      console.log("Updated Oximetry Measurements:", oximetryMeasurements);

      // Calcula as médias
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

      const oximetryAverage = Math.round(
        oximetryMeasurements.reduce((sum, value) => sum + value, 0) /
          oximetryMeasurements.length
      );

      console.log(`Current Temperature Average: ${tempAverage}°C`);
      console.log(`Current Heartbeat Average: ${heartbeatAverage}`);
      console.log(`Current Oximetry Average: ${oximetryAverage}`);

      // Responde rapidamente para evitar timeout
      res.setOption("Content-Format", "application/json");
      res.end(
        JSON.stringify({
          status: "success",
          message: "Request received",
        })
      );

      // Processamento assíncrono para salvar os dados no Firebase
      (async () => {
        try {
          // Salva os dados de temperatura e batimentos no Firebase
          const sensorPath = `sensors/database`;
          const ref = db.ref(sensorPath);
          const timestamp = Math.floor(Date.now() / 1000);

          const sensorData: ISensor = {
            temperature: tempAverage,
            sex: data.sex,
            ageGroup: data.ageGroup,
            oximetry: oximetryAverage,
            timestamp: timestamp,
            heartbeat: heartbeatAverage,
          };

          if (heartbeatAverage > 45) {
            await ref.push(sensorData);
            console.log("Data saved to Firebase:", {
              temperature,
              heartbeat,
              oximetry: oximetryAverage,
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
