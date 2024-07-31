import { config } from "dotenv";
config();

export const PORT = 3000;
export const MONGODB_URI = process.env.MONGODB_URL;
