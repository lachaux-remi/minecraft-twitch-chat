# <img alt="Logo" height="24" src="assets/logo.png" width="24"/> Minecraft Twitch Chat

Display chats from one or more Twitch channels in the Minecraft chat interface, showcasing subscriber badges, hype train
badges, VIP, moderator, and broadcaster badges. Additionally, present emotes in text form with varying colors for
enhanced chat readability.

## Usage

Download the latest release from the [releases](https://github.com/lachaux-remi/minecraft-twitch-chat/releases) page or
clone the project.

```bash
  git clone git@github.com:lachaux-remi/minecraft-twitch-chat.git
```

Navigate to the project directory

```bash
  cd minecraft-twitch-chat
```

Install the dependencies

```bash
  pnpm install
```

Copy the `.env.example` file to `.env` and fill in the required information (see [Configuration](#configuration))

```bash
  cp .env.example .env
```

Start the app for production

```bash
  pnpm run start
```

or for development

```bash
  pnpm run dev
```

## Configuration

| Variable name                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| MINECRAFT_HOST                           | The host of the Minecraft server to connect to.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| MINECRAFT_RCON_PORT                      | The port of the Minecraft server to connect to.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| MINECRAFT_RCON_PASSWORD                  | The password of the Minecraft server to connect to.                                                                                                                                                                                                                                                                                                                                                                                                                                               | 
| TWITCH_CHANNELS                          | The list of channels to connect to. (separated by a comma)                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| TWITCH_IGNORE_USERS                      | The list of users to ignore. (separated by a comma)                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| TELLRAW_MESSAGE_TWITCH                   | The tellraw message to display Twitch messages.<br/>``%channel%`` will be replaced by ``TELLRAW_MESSAGE_TWITCH_CHANNEL``,<br/>``%viewer%`` will be replaced by ``TELLRAW_MESSAGE_TWITCH_VIEWER``,<br/>``%message%`` will be replaced by the message)                                                                                                                                                                                                                                              |
| TELLRAW_MESSAGE_TWITCH_COLOR             | The color of the tellraw message to display Twitch messages.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| TELLRAW_MESSAGE_TWITCH_EMOTES_COLOR      | The color of the tellraw message to display Twitch emotes.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| TELLRAW_MESSAGE_TWITCH_CHANNEL           | The tellraw message to display the channel name. (only show if ``TELLRAW_MESSAGE_TWITCH`` contains ``%channel%`` and ``TWITCH_CHANNELS`` contains more than one channel)                                                                                                                                                                                                                                                                                                                          |
| TELLRAW_MESSAGE_TWITCH_VIEWER            | The tellraw message to display the viewer name. (only show if ``TELLRAW_MESSAGE_TWITCH`` contains ``%viewer%``)<br/>``%badges%`` will be replaced by the badges [``TELLRAW_MESSAGE_TWITCH_BADGE_BRODCASTER``, ``TELLRAW_MESSAGE_TWITCH_BADGE_MODERATOR``, ``TELLRAW_MESSAGE_TWITCH_BADGE_VIP``, ``TELLRAW_MESSAGE_TWITCH_BADGE_SUBSCRIBER``, ``TELLRAW_MESSAGE_TWITCH_BADGE_HYPE_TRAIN``]<br/>``%name%`` will be replaced by the viewer name<br/>``%color%`` will be replaced by the viewer color |
| TELLRAW_MESSAGE_TWITCH_VIEWER_COLOR      | The default color of the tellraw message to display the viewer name.                                                                                                                                                                                                                                                                                                                                                                                                                              |
| TELLRAW_MESSAGE_TWITCH_BADGE_BROADCASTER | The tellraw message to display the broadcaster badge. (only show if ``TELLRAW_MESSAGE_TWITCH_VIEWER`` contains ``%badges%`` and the viewer is a broadcaster)                                                                                                                                                                                                                                                                                                                                      |
| TELLRAW_MESSAGE_TWITCH_BADGE_MODERATOR   | The tellraw message to display the moderator badge. (only show if ``TELLRAW_MESSAGE_TWITCH_VIEWER`` contains ``%badges%`` and the viewer is a moderator)                                                                                                                                                                                                                                                                                                                                          |
| TELLRAW_MESSAGE_TWITCH_BADGE_VIP         | The tellraw message to display the VIP badge. (only show if ``TELLRAW_MESSAGE_TWITCH_VIEWER`` contains ``%badges%`` and the viewer is a VIP)                                                                                                                                                                                                                                                                                                                                                      |
| TELLRAW_MESSAGE_TWITCH_BADGE_SUBSCRIBER  | The tellraw message to display the subscriber badge. (only show if ``TELLRAW_MESSAGE_TWITCH_VIEWER`` contains ``%badges%`` and the viewer is a subscriber)                                                                                                                                                                                                                                                                                                                                        |
| TELLRAW_MESSAGE_TWITCH_BADGE_HYPE_TRAIN  | The tellraw message to display the hype train badge. (only show if ``TELLRAW_MESSAGE_TWITCH_VIEWER`` contains ``%badges%`` and the viewer is a hype train contributor)                                                                                                                                                                                                                                                                                                                            |

## License

[MIT](LICENSE)

## Authors

- [@lachaux-remi](https://www.github.com/lachaux-remi)
