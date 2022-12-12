import * as dotenv from 'dotenv';
dotenv.config();

import { Client, Events, GatewayIntentBits } from 'discord.js';
import { welcomeMessage } from './strings';

// @ts-ignore
export const client = new Client({ intents: [GatewayIntentBits.GuildMembers] });

client.on(Events.ClientReady, () => {
  console.info(`${client.user?.username} is online.`);
});

client.on(Events.GuildMemberAdd, async (member) => {
  console.info(`Member added to server: ${member.user?.username}`);
  await member.send(welcomeMessage);
  console.info('Welcome message sent to user: ${member.user?.username}');

  // send a message to the admin channel to let us know about the new member
  try {
    // @ts-ignore
    client.channels.cache
      // @ts-ignore
      .get(process.env.ADMIN_CHANNEL)
      // @ts-ignore
      .send(
        `${member.user?.username} has joined the server. Please add the guy/girl role to their account.`
      );
  } catch (e) {
    console.error(`Failed to send member added notice to admin channel: ${e}`);
  }
});

// add role to user
// const member = interaction.options.getMember('target');
// if (member.roles.cache.some(role => role.name === 'role name')) {
//   member.roles.add(role);
// }

client.login(process.env.TOKEN);
