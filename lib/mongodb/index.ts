// ********************* BEGINNING CODE OVERVIEW EXPLANATION OF THIS PATTERN SERVERLESS MONGODB DATABASE ********************* //

/* This code efficiently manages MongoDB connections by caching the connection object and promise. 
If a connection is already established, it returns the cached connection; otherwise, it creates a new connection. 
This approach helps reduce the overhead of creating new connections, especially in serverless environments where resources are limited. */

// ********************* ENDING CODE OVERVIEW EXPLANATION OF THIS PATTERN SERVERLESS MONGODB DATABASE ********************* //

import mongoose from "mongoose";

// Define the MongoDB connection in the .env file
const MONGODB_URI = process.env.MONGODB_URI;

// let cached = mongoose || { conn: null, promise: null }; // This will be error because TypeScript don't know which 'conn' we are referring to? (old-code)

// Initialize a cache object to store the database connection and promise
// If a connection is already established, use the cached connection; otherwise, create a new one
// This pattern is used to efficiently manage database connections in a serverless environment
// Pro tips ---- Accessing the global scope to retrieve the Mongoose instance, if available. Means we are referring to this global type of mongoose (new-code)
let cached = (global as any).mongoose || { conn: null, promise: null };

// Function to connect to the MongoDB database
export const connectToDatabase = async () => {
  // If cached connection is exist, then it return this connection
  if (cached.conn) {
    console.log("Successfully connected with OwLabs database!");
    return cached.conn;
  }

  // If MONGODB_URI is not exist, then it will throw this error
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  // If no cached promise exists, create a new promise to connect to the MongoDB database
  // and store it in the cached object to avoid redundant connection attempts
  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "OwLabs", // Specify the name of the MongoDB database
      bufferCommands: false, // Disable buffering of MongoDB commands
    });

  // Await the resolution of the promise to get the database connection
  cached.conn = await cached.promise;

  // Return the established database connection
  return cached.conn;
};
