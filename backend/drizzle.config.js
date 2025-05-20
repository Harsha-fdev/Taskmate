import { defineConfig } from "drizzle-kit";

require('dotenv').config();

export default defineConfig({
  schema: "./src/models/schema.ts",    // path to your Drizzle schema file(s)
  out: "./drizzle/migrations",        // folder to save migration files 
  dialect: "postgresql",                      
  dbCredentials: {
    url: process.env.DATABASE_URL,  // your DB connection string
  },
});