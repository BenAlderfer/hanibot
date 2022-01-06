require('dotenv').config();

import { Client } from "discord.js";

const client = new Client();

client.on("ready", async () => {
    console.info(`${client.user?.username} is online.`);
});

client.login(process.env.TOKEN);
