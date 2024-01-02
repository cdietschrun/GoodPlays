import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import express from 'express';

// Create a new client instance
const client = new Client({ intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
] });

client.commands = new Collection();

const eventsPath = path.join(import.meta.url, '../events');
fs.readdirSync(new URL('./events', import.meta.url)).forEach((dirContent) => {
	const filePath = path.join(eventsPath, dirContent);
	    
  import(filePath).then((exported) => {
      const event = exported.default;
    	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
      });
});

client.login(process.env.BOT_TOKEN);
const app = express();
const PORT = process.env.PORT || 9000;
app.listen(PORT, () =>
{
  console.log(`[${new Date().toString()}] Listening on port: ${PORT}`);
});