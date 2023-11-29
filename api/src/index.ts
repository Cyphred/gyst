import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import rootRouter from "./routes/routes.js";

// Load .env data
dotenv.config();

// Grab port number from .env
// Default to port 8000 if not defined
let port = parseInt(process.env.PORT);
if (!port || isNaN(port)) port = 8000;

// Store required .env variables
const requiredEnvVariables = [process.env.JWT_SECRET, process.env.MONGO_URI];

// Stop the program if a required variable was not set
for (const envVar of requiredEnvVariables) {
  if (envVar === undefined)
    throw new Error("A required value in the .env is not set");
}

// Attempt to connect to MongoDB server
try {
  console.log(
    `Attempting to connect to MongoDB at ${process.env.MONGO_URI}...`
  );
  await mongoose.connect(process.env.MONGO_URI);
} catch (err) {
  console.error(err);
  throw new Error(
    `Could not connect to MongoDB server at ${process.env.MONGO_URI}`
  );
}

// Create express app
const app = express();

// Enables parsing of incoming data into json
app.use(express.json());

// Trust the proxy
app.set("trust proxy", true);

// Logs incoming requests to console
app.use((req, res, next) => {
  console.log(req.path, req.method, req.ips);
  next();
});

// IMPORTANT NOTE
// Change the origin to the domain during production
app.use(
  cors({
    origin: "*",
  })
);

// Load in root router
app.use("/api", rootRouter);

// Start listening for requests
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

export default app;
