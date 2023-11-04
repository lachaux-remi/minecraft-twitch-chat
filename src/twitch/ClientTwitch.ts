import { ChatUserstate, Client } from "tmi.js";

import { clientRcon, logger } from "../app";

class ClientTwitch {
  private readonly channels: string[];
  private ignoreUsers: string[];

  public constructor() {
    this.channels = process.env.TWITCH_CHANNELS!.replaceAll(" ", "").split(",") || [];
    this.ignoreUsers = process.env.TWITCH_IGNORE_USERS!.replaceAll(" ", "").split(",") || [];
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
      .on("clearchat", this.clearChat)
      .on("messagedeleted", this.clearChat)
      .on("chat", (channel: string, userState: ChatUserstate, message: string, self: boolean) => {
        if (self || message.startsWith("!") || this.ignoreUsers.includes(userState.username!)) {
          return;
        }

        const parsedMessage = [
          "",
          { text: "[", color: "#939597" },
          { text: "Twitch", color: "#9146ff" },
          { text: "]", color: "#939597" },
          ...this.channelInfo(channel),
          { text: " " },
          ...this.viewerInfo(userState),
          { text: " " },
          { text: ">", color: "#939597" },
          { text: " " },
          ...this.parseEmotes(message, userState.emotes || {})
        ];

        clientRcon.send(`tellraw @a ${JSON.stringify(parsedMessage)}`);
      });

    client
      .connect()
      .then(() => logger.info("Connecté aux chats Twitch"))
      .catch(error => {
        logger.error("Erreur lors de la connexion Twitch");
        logger.error(error);
      });
  }

  private channelInfo(channel: string): object[] {
    if (this.channels.length > 1) {
      return [
        { text: "[", color: "#939597" },
        { text: channel.replaceAll("#", ""), color: "#b39500" },
        { text: "]", color: "#939597" }
      ];
    }

    return [];
  }

  private viewerInfo(userState: ChatUserstate): object[] {
    const infos: object[] = [];

    if (userState.badges?.broadcaster) {
      infos.push({
        text: "📽",
        color: "#e91915"
      });
      infos.push({ text: " " });
    } else {
      if (userState.badges?.moderator) {
        infos.push({
          text: "🗡",
          color: "#00ad03"
        });
        infos.push({ text: " " });
      }

      if (userState.badges?.vip) {
        infos.push({
          text: "💎",
          color: "#e004b8"
        });
        infos.push({ text: " " });
      }

      if (userState.badges?.subscriber || userState.badges?.founder) {
        infos.push({
          text: "⭐",
          color: "#00d0ff"
        });
        infos.push({ text: " " });
      }

      if (userState.badges?.["hype-train"]) {
        infos.push({
          text: "🚂",
          color: "#772be7"
        });
        infos.push({ text: " " });
      }
    }

    return [
      ...infos,
      {
        text: userState["display-name"] || userState.username,
        color: userState.color || "white"
      }
    ];
  }

  private parseEmotes(message: string, emotes: { [emoteId: string]: string[] }): object[] {
    let newMessage = message;
    const emoteIdentifier = Math.random().toString(36).substring(7);
    const slitIdentifier = Math.random().toString(36).substring(7);

    Object.keys(emotes).forEach(emoteId => {
      const emoteIndices = emotes[emoteId];
      const [start, end] = emoteIndices[0].split("-").map(Number);

      const emoteText = message.substring(start, end + 1);
      newMessage = newMessage.replaceAll(emoteText, `${slitIdentifier}${emoteIdentifier}${emoteText}${slitIdentifier}`);
    });

    return newMessage
      .split(slitIdentifier)

      .map(part => part.trim())
      .filter(Boolean)
      .map(part => {
        if (part.startsWith(emoteIdentifier)) {
          return { text: part.replace(emoteIdentifier, ""), color: "#6a645a" };
        }

        return { text: part, color: "white" };
      })
      .reduce((accumulator: object[], current, index, array) => {
        accumulator.push(current);
        if (index < array.length - 1) {
          accumulator.push({ text: " " });
        }
        return accumulator;
      }, []);
  }

  private clearChat(): void {
    for (let i = 0; i < 25; i++) {
      clientRcon.send(`tellraw @a [{"text":""}]`);
    }
  }
}

export default ClientTwitch;
