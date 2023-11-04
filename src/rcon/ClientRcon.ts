import { Rcon } from "rcon-client";

import { logger } from "../app";

class ClientRcon {
  private _rcon: Rcon | null = null;
  private retryTimer: NodeJS.Timeout | null = null;
  private waitingCommandsList: string[] = [];

  public connect(): void {
    const rcon = new Rcon({
      host: process.env.MINECRAFT_HOST!,
      port: parseInt(process.env.MINECRAFT_RCON_PORT!) || undefined,
      password: process.env.MINECRAFT_RCON_PASSWORD!
    });

    rcon
      .on("end", () => {
        logger.info("Déconnecté du serveur Minecraft");
        this.restartRetryTimer();
      })
      .on("error", error => logger.error(error));

    rcon
      .connect()
      .then(() => {
        logger.info("Connecté au serveur Minecraft");

        this.clearRetryTimer();
        this._rcon = rcon;

        this.waitingCommandsList.forEach(command => this.send(command));
      })
      .catch(error => {
        logger.error("Erreur lors de la connexion RCON :", error);
        this.restartRetryTimer();
      });
  }

  public send(command: string): void {
    if (!this._rcon) {
      this.waitingCommandsList.push(command);
      return;
    }

    this._rcon!.send(command).catch(error => logger.error("Erreur lors de l'envoi de la commande RCON :", error));
  }

  private clearRetryTimer(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }

  private restartRetryTimer(): void {
    this.clearRetryTimer();
    if (this.retryTimer) {
      this.retryTimer = setTimeout(() => this.connect(), 5000);
    }
  }
}

export default ClientRcon;
