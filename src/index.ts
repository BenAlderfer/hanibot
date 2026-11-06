import dotenv from 'dotenv';

dotenv.config();

import {
  Client,
  DiscordAPIError,
  Events,
  GatewayIntentBits,
  RESTJSONErrorCodes,
  escapeMarkdown,
  userMention
} from 'discord.js';
import { welcomeMessage } from './strings';
import { BOT_TOKEN, LOG_CHANNEL_ID } from './config';
import { ChannelLogger } from './channelLogger';
import { startHeartbeat } from './health';

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});
export const channelLogger = new ChannelLogger(client, LOG_CHANNEL_ID);

client.on(Events.ClientReady, () => {
  console.info(`${client.user?.username} is online.`);
  void channelLogger.checkChannel();
});

// Without listeners, connection problems are easy to miss in the logs.
client.on(Events.Error, (error) =>
  console.error('Discord client error', error)
);
client.on(Events.ShardError, (error, shardId) =>
  console.error(`Discord shard ${shardId} error`, error)
);

// Keeps channel log messages well under Discord's 2000 character limit.
const MAX_REASON_LENGTH = 500;

client.on(Events.GuildMemberAdd, async (member) => {
  const { username } = member.user;
  const user = `${userMention(member.user.id)} (${escapeMarkdown(username)})`;
  console.info(`Member '${username}' added to server`);

  try {
    await member.send(welcomeMessage);
  } catch (error) {
    // Users with DMs closed are expected, so don't log them as errors.
    if (
      error instanceof DiscordAPIError &&
      error.code === RESTJSONErrorCodes.CannotSendMessagesToThisUser
    ) {
      console.warn(
        `User has DMs disabled, welcome message not sent: ${username}`
      );
    } else {
      console.error(
        `Failed to send welcome message to user: ${username}`,
        error
      );
    }
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
  // Crash on stray rejections so Docker restarts the bot cleanly.
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled promise rejection', reason);
    process.exit(1);
  });

  void startBot(BOT_TOKEN).then(() => {
    // A failed login must exit so the container restarts instead of hanging.
    if (process.exitCode) {
      process.exit();
    }
    startHeartbeat(client);
  });
}
