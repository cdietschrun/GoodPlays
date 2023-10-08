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
const foldersPath = path.join(import.meta.url, '../commands');

fs.readdirSync(new URL('./commands', import.meta.url)).forEach((dirContent) => {
	const commandsPath = path.join(foldersPath, dirContent);
	const commandFiles = fs.readdirSync(new URL(commandsPath, import.meta.url)).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
    import(filePath).then((exported) => {
      const command = exported.default;
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
      });
	}
});

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