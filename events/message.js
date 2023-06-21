import { Events } from 'discord.js';

const messageCreate = {
	name: Events.MessageCreate,
	once: false,
	execute(message) {
		console.log(`msg ${message}`);
	},
};

export default messageCreate;