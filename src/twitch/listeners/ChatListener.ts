import { ChatUserstate, Client } from "tmi.js";

import { clientRcon, clientTwitch } from "../../app";

class ChatListener {
  private readonly ignoreUsers: string[];

  public constructor(client: Client) {
    this.ignoreUsers = process.env.TWITCH_IGNORE_USERS!.replaceAll(" ", "").split(",") || [];

    client.on("chat", this.handleChat.bind(this));
    client.on("clearchat", this.handleClearChat.bind(this));
    client.on("messagedeleted", this.handleClearChat.bind(this));
  }

  private handleClearChat(): void {
    for (let i = 0; i < 25; i++) {
      clientRcon.send(`tellraw @a [{"text":""}]`);
    }
  }

  private handleChat(channel: string, userState: ChatUserstate, twitchMessage: string, self: boolean): void {
    if (self || twitchMessage.startsWith("!") || this.ignoreUsers.includes(userState.username!)) {
      return;
    }

    let message =
      process.env.TELLRAW_MESSAGE_TWITCH ||
      `["",{"text":"[","color":"#939597"},{"text":"Twitch","color":"#9146ff"},{"text":"]","color":"#939597"},%channel%,{"text":" "},%viewer%,{"text":" "},{"text":">","color":"#939597"},{"text":" "},%message%]`;
    message = message
      .replaceAll("%channel%", this.channelInfo(channel))
      .replaceAll("%viewer%", this.viewerInfo(userState))
      .replaceAll("%message%", this.parseEmotes(twitchMessage, userState.emotes || {}));

    clientRcon.send(`tellraw @a ${message}`);
  }

  private channelInfo(channel: string): string {
    if (clientTwitch.channels.length > 1) {
      const message =
        process.env.TELLRAW_MESSAGE_TWITCH_CHANNEL ||
        `{"text":"[","color":"#939597"},{"text":"%name%","color":"#b39500"},{"text":"]","color":"#939597"}`;
      return message.replaceAll("%name%", channel.replaceAll("#", ""));
    }

    return `""`;
  }

  private viewerInfo(userState: ChatUserstate): string {
    const badges: string[] = [`""`];
    if (userState.badges?.broadcaster) {
      badges.push(
        process.env.TELLRAW_MESSAGE_TWITCH_BADGE_BROADCASTER || `{"text":"📽","color":"#e91915"},{"text":" "}`
      );
    } else {
      if (userState.badges?.moderator) {
        badges.push(
          process.env.TELLRAW_MESSAGE_TWITCH_BADGE_MODERATOR || `{"text":"🗡","color":"#00ad03"},{"text":" "}`
        );
      }

      if (userState.badges?.vip) {
        badges.push(process.env.TELLRAW_MESSAGE_TWITCH_BADGE_VIP || `{"text":"💎","color":"#e004b8"},{"text":" "}`);
      }

      if (userState.badges?.subscriber || userState.badges?.founder) {
        badges.push(
          process.env.TELLRAW_MESSAGE_TWITCH_BADGE_SUBSCRIBER || `{"text":"⭐","color":"#00d0ff"},{"text":" "}`
        );
      }

      if (userState.badges?.["hype-train"]) {
        badges.push(
          process.env.TELLRAW_MESSAGE_TWITCH_BADGE_HYPE_TRAIN || `{"text":"🚂","color":"#772be7"},{"text":" "}`
        );
      }
    }

    const message = process.env.TELLRAW_MESSAGE_TWITCH_VIEWER || `%badges%,{"text":"%name%","color":"%color%"}`;
    return message
      .replaceAll("%name%", userState["display-name"] || userState.username! || "anonymous")
      .replaceAll("%color%", userState.color || process.env.TELLRAW_MESSAGE_TWITCH_VIEWER_COLOR || "#ffffff")
      .replaceAll("%badges%", badges.join(","));
  }

  private parseEmotes(message: string, emotes: { [emoteId: string]: string[] }): string {
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
          return `{"text":"${part.replace(emoteIdentifier, "")}","color":"${
            process.env.TELLRAW_MESSAGE_TWITCH_EMOTES_COLOR || "#6a645a"
          }"}`;
        }

        return `{"text":"${part}","color":"${process.env.TELLRAW_MESSAGE_TWITCH_COLOR || "#ffffff"}"}`;
      })
      .reduce((accumulator: string[], current, index, array) => {
        accumulator.push(current);
        if (index < array.length - 1) {
          accumulator.push(`{"text":" "}`);
        }
        return accumulator;
      }, [])
      .join(",");
  }
}

export default ChatListener;
