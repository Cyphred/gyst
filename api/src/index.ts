import dotenv from "dotenv";

dotenv.config();

// Grab port number from .env
// Default to port 8000 if not defined
let port = parseInt(process.env.PORT);
if (!port || isNaN(port)) port = 8000;

console.log("Using port", port);
