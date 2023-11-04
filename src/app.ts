import dotenv from "dotenv";
import path from "path";
import pino from "pino";

import ClientRcon from "./rcon/ClientRcon";
import ClientTwitch from "./twitch/ClientTwitch";

export const logger = pino({ level: "debug" });

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const clientRcon = new ClientRcon();
clientRcon.connect();

export const clientTwitch = new ClientTwitch();
clientTwitch.connect();
