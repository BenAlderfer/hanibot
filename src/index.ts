import dotenv from 'dotenv';

dotenv.config();

import { Client, Events, GatewayIntentBits } from 'discord.js';
import { welcomeMessage } from './strings';
import { BOT_TOKEN } from './config';

// @ts-ignore
export const client = new Client({ intents: [GatewayIntentBits.GuildMembers] });

client.on(Events.ClientReady, () => {
  console.info(`${client.user?.username} is online.`);
});

client.on(Events.GuildMemberAdd, async (member) => {
  try {
    console.info(`Member '${member.user?.username}' added to server`);
    await member.send(welcomeMessage);
    console.info(`Welcome message sent to user: ${member.user?.username}`);
  } catch (e) {
    console.error(
      `Failed to send welcome message sent to user: ${member.user?.username}`
    );
  }
});

// add role to user
// const member = interaction.options.getMember('target');
// if (member.roles.cache.some(role => role.name === 'role name')) {
//   member.roles.add(role);
// }

client.login(BOT_TOKEN).then(() => console.log(`bot logged in`));
