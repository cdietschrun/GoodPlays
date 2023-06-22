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
import { VerifyDiscordRequest, DiscordRequest } from './utils.js';
import fetch from "node-fetch";
import { request } from 'undici';
import db from './connections/mongo.js';
import { ObjectId } from "mongodb";
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
  
  app.get('/data', async function (req, response) {
    
  let collection = await db.collection("game_play");
  let results = await collection.aggregate([
    {"$project": {"userId": 1, "gameName": 1, "startTimestamp": 1, "endTimestamp": 1}},
    {"$sort": {"endTimestamp": -1}},
    {"$limit": 3}
  ]).toArray();
  response.send(results).status(200);
    
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

        'scope': 'identify'
      })
    }

    let discord_data = await fetch('https://discord.com/api/oauth2/token', options).then((response) => {
      return response.json();
    }).then((response) => {
      return response;
    });

    console.log(discord_data);

        const userResult = await request('https://discord.com/api/users/@me', {
          headers: {
            authorization: `${discord_data.token_type} ${discord_data.access_token}`,
          },
        });

    console.log(await userResult.body.json());
    
    response.send('heyy');
  });

  app.listen(PORT, () => {
    console.log('Listening on 1port', PORT);
  });

}