const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv/config');
const { MongoClient } = require('mongodb');


// Create a new client instance
const client = new Client({ intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Replace the uri string with your MongoDB deployment's connection string.a
const uri = `mongodb+srv://cdietschrunfast:${process.env.MONGO_DB_PASSWORD}@goodplays.yhu6h4r.mongodb.net/?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(uri);
async function run() {
  try {
    const database = mongoClient.db("sample_mflix");
    const movies = database.collection("movies");
    // Query for a movie that has the title 'The Room'
    const query = { title: "The Room" };
    const options = {
      // sort matched documents in descending order by rating
      sort: { "imdb.rating": -1 },
      // Include only the `title` and `imdb` fields in the returned document
      projection: { _id: 0, title: 1, imdb: 1 },
    };
    const movie = await movies.findOne(query, options);
    // since this method returns the matched document, not a cursor, print it directly
    console.log(movie);
  } finally {
    await mongoClient.close();
  }
}
run().catch(console.dir);

client.login(process.env.BOT_TOKEN);