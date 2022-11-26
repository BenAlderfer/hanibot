import * as dotenv from 'dotenv';
dotenv.config();

import { Client, GatewayIntentBits } from 'discord.js';
import { welcomeMessage } from './strings';

// @ts-ignore
const client = new Client({ intents: [GatewayIntentBits.GuildMembers] });

client.on('ready', async () => {
  console.info(`${client.user?.username} is online.`);
});

client.on('guildMemberAdd', async member => {
  console.info(`member added: ${member.user?.username}`);
  await member.send(welcomeMessage);
  console.info('message sent to user: ${member.user?.username}');
});

client.login(process.env.TOKEN);


// const { PrismaClient } = require("@prisma/client");
//
// const prisma = new PrismaClient();
//
// (async () => {
//   try {
//     console.log(await prisma.restaurant.create({ data: { } }));
//   } catch (err) {
//     console.error("error executing query:", err);
//   } finally {
//     prisma.$disconnect();
//   }
// })();