import * as dotenv from 'dotenv';
dotenv.config();

import { Client, Intents } from 'discord.js';
import { welcomeMessage } from './strings';

// @ts-ignore
const client = new Client({ intents: [Intents.FLAGS.GUILD_MEMBERS] });

client.on('ready', async () => {
  console.info(`${client.user?.username} is online.`);
});

client.on('guildMemberAdd', async member => {
  console.info(`member added`);
  await member.send(welcomeMessage);
  console.info('message sent to user');
});

client.login(process.env.TOKEN);
