require('dotenv').config();

import { Client } from "discord.js";

// @ts-ignore
const client = new Client();

client.on("ready", async () => {
    console.info(`${client.user?.username} is online.`);
});

client.on("GUILD_MEMBER_ADD", async () => {
    console.info(`member added`);
});

client.login(process.env.TOKEN);
