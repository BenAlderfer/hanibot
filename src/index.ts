import dotenv from 'dotenv';

dotenv.config();

import {
  Client,
  Events,
  GatewayIntentBits,
  escapeMarkdown,
  userMention
} from 'discord.js';
import { welcomeMessage } from './strings';
import { BOT_TOKEN, LOG_CHANNEL_ID } from './config';
import { ChannelLogger } from './channelLogger';

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});
export const channelLogger = new ChannelLogger(client, LOG_CHANNEL_ID);

client.on(Events.ClientReady, () => {
  console.info(`${client.user?.username} is online.`);
  void channelLogger.checkChannel();
});

client.on(Events.GuildMemberAdd, async (member) => {
  try {
    console.info(`Member '${member.user.username}' added to server`);
    await member.send(welcomeMessage);
    console.info(`Welcome message sent to user: ${member.user.username}`);
    await channelLogger.send(
      `Welcome message sent to ${userMention(member.user.id)} (${escapeMarkdown(member.user.username)})`
    );
  } catch (error) {
    console.error(
      `Failed to send welcome message sent to user: ${member.user.username}`,
      error
    );
  }
});

export function startBot(token: string | undefined) {
  if (!token) {
    throw new Error('Missing required TOKEN environment variable');
  }

  return client
    .login(token)
    .then(() => console.log(`bot logged in`))
    .catch((error) => {
      console.error('Failed to log in to Discord', error);
      process.exitCode = 1;
    });
}

if (require.main === module) {
  startBot(BOT_TOKEN);
}
