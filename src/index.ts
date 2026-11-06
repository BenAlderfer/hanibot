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

// Keeps channel log messages well under Discord's 2000 character limit.
const MAX_REASON_LENGTH = 500;

client.on(Events.GuildMemberAdd, async (member) => {
  const { username } = member.user;
  const user = `${userMention(member.user.id)} (${escapeMarkdown(username)})`;
  console.info(`Member '${username}' added to server`);

  try {
    await member.send(welcomeMessage);
  } catch (error) {
    console.error(`Failed to send welcome message to user: ${username}`, error);
    const reason = error instanceof Error ? error.message : String(error);
    await channelLogger.send(
      `Failed to send welcome message to ${user}: ${escapeMarkdown(reason.slice(0, MAX_REASON_LENGTH))}`
    );
    return;
  }

  console.info(`Welcome message sent to user: ${username}`);
  await channelLogger.send(`Welcome message sent to ${user}`);
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
