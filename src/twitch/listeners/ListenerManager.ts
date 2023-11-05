import { Client } from "tmi.js";

import ChatListener from "./ChatListener";

class ListenerManager {
  public constructor(client: Client) {
    new ChatListener(client);
  }
}

export default ListenerManager;
