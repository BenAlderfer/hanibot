import dotenv from 'dotenv';

dotenv.config();

import { Client, Events, GatewayIntentBits } from 'discord.js';
import { welcomeMessage } from './strings';
import { BOT_TOKEN } from './config';

export const client = new Client({ intents: [GatewayIntentBits.GuildMembers] });

client.on(Events.ClientReady, () => {
  console.info(`${client.user?.username} is online.`);
});

client.on(Events.GuildMemberAdd, async (member) => {
  try {
    console.info(`Member '${member.user?.username}' added to server`);
    await member.send(welcomeMessage);
    console.info(`Welcome message sent to user: ${member.user?.username}`);
  } catch (error) {
    console.error(
      `Failed to send welcome message sent to user: ${member.user?.username}`,
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
