import { Events } from 'discord.js';

const clientReady = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Rea111dy! Logged in as ${client.user.tag}`);
	},
};

export default clientReady;