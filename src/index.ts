import express, { Express } from "express";
import http from "http";
import routes from "./routes/routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Express = express();
const PORT = process.env.PORT || 8000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
  cors({
    origin: process.env.REACT_APP_URL,
    credentials: true,
  })
);

// Routes setup
app.use(routes);

// Create HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
