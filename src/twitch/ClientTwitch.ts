import { Client } from "tmi.js";

import { logger } from "../app";
import ListenerManager from "./listeners/ListenerManager";

class ClientTwitch {
  public readonly channels: string[];

  public constructor() {
    this.channels = process.env.TWITCH_CHANNELS!.replaceAll(" ", "").split(",") || [];
  }

  public connect(): void {
    const client = new Client({
      connection: {
        reconnect: true,
        secure: true
      },
      channels: this.channels,
      logger: {
        info: () => {},
        warn: () => {},
        error: () => {}
      }
    });

    client
      .connect()
      .then(() => {
        logger.info("Connecté aux chats Twitch");

        new ListenerManager(client);
      })
      .catch(error => {
        logger.error("Erreur lors de la connexion Twitch");
        logger.debug(error);
      });
  }
}

export default ClientTwitch;
