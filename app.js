import DiscordOauth2 from "discord-oauth2";
import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
import fetch from "node-fetch";
import { request } from 'undici';
import { MongoClient } from 'mongodb';
import cors from 'cors';

export async function StartExpressServer() {
  
  // Create an express app
  const app = express();
  // Get port, or default to 3000
  const PORT = process.env.PORT || 3000;
  // Parse request body and verifies incoming requests using discord-interactions package1
  app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));
  const token = '';
  app.use(cors());

      // Replace the uri string with your MongoDB deployment's connection string.a
const uri = `mongodb+srv://cdietschrunfast:${process.env.MONGO_DB_PASSWORD}@goodplays.yhu6h4r.mongodb.net/?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(uri);
  
  app.get('/data', async function (req, response) {

    let data = {};
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
    data = movie;
  } finally {
    await mongoClient.close();
  }

  //run().catch(console.dir);  
    response.send(data);
    
  });
  
  app.get('/redirect', async function (req, response) {

    console.log(req.query);

    let options = {
      url: 'https://discord.com/api/oauth2/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'client_id': process.env.APP_ID,
        'client_secret': process.env.DISCORD_TOKEN,
        'grant_type': 'authorization_code',
        'code': req.query.code,
        'redirect_uri': `https://nostalgic-pollen-antimatter.glitch.me/redirect`,

        'scope': 'identify connections role_connections.write guilds.members.read'
      })
    }

    let discord_data = await fetch('https://discord.com/api/oauth2/token', options).then((response) => {
      return response.json();
    }).then((response) => {
      return response;
    });

    console.log(discord_data);

        const userResult = await request('https://discord.com/api/users/@me/connections', {
          headers: {
            authorization: `${discord_data.token_type} ${discord_data.access_token}`,
          },
        });

    console.log(await userResult.body.json());

      const applicationRoleResult = await request(`https://discord.com/api/users/@me/applications/${process.env.APP_ID}/role-connection`, {
      headers: {
        authorization: `${discord_data.token_type} ${discord_data.access_token}`,
      },
    });

    console.log(await applicationRoleResult.body.json());

    const guildIdMemberResult = await request(`https://discord.com/api/users/@me/guilds/${process.env.TESTSERVER_GUILD_ID}/member`, {
      headers: {
        authorization: `${discord_data.token_type} ${discord_data.access_token}`,
      },
    });
    
    let memberRoles = await guildIdMemberResult.body.json();
    console.log(memberRoles);
    if (memberRoles.roles.includes('1120952650930856027'))
    {
      console.log('found it');
    }
    else {
      console.log('did not find');
    }
    
    
    response.send('heyy');
  });

  app.listen(PORT, () => {
    console.log('Listening on 1port', PORT);
  });

}