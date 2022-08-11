import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;
const configDatabase = {
  connectionString: process.env.DATABASE_URL
}

if(process.env.MODE === "PROD") {
  configDatabase.ssl = {
    rejectUnauthorized: false
  }
}

const connection = new Pool(configDatabase);

export default connection;

