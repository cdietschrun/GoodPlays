import { SlashCommandBuilder } from'discord.js';

const pingObj = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Paong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};

export default pingObj