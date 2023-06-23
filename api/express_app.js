import DiscordOauth2 from "discord-oauth2";
import crypto from "crypto";
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
  // Get port, or default to 9000
  const PORT = process.env.PORT || 9000;
  // Parse request body and verifies incoming requests using discord-interactions package1
  app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));
  const token = '';
  app.use(cors());
  
  app.get('/data', async function (req, response) {
    
    const userId = req.query.userId;
    console.log(userId);
  let collection = await db.collection("game_play");
//   let results = await collection.aggregate([
//     {"$project": {"gameName": 1, "startTimestamp": 1, "endTimestamp": 1, "userId": 1}},
//     {"$sort": {"endTimestamp": -1}},
//     {"$limit": 3}
//   ]).toArray();
    const query = { userId: userId };
    const options = {
        sort: {endTimestamp: -1},
        projection: { gameName: 1, startTimestamp: 1, endTimestamp: 1, _id: 0}
    };

    let results = await collection.find(query, options).toArray();

  //response.send('aaabcde');
  response.send(results).status(200);
  });
  
  app.post('/token', async (request, reply) => {
    const { code, client_id, redirect_uri } = request.query;
    
    let options = {
      url: 'https://discord.com/api/oauth2/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'client_id': client_id,
        'client_secret': process.env.DISCORD_TOKEN,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,

        'scope': 'identify'
      })
    };
    
    let discord_data = await fetch('https://discord.com/api/oauth2/token', options).then((response) => {
      return response.json();
    });
    
    reply.send(discord_data);
    
  });
          
           
  app.get('/getoauthloginurl', async function (req, res) {
     const oauth = new DiscordOauth2({
       clientId: process.env.APP_ID,
       clientSecret: process.env.DISCORD_TOKEN,
       redirectUri: 'https://nostalgic-pollen-antimatter.glitch.me/redirect'
     });
    
    const url = oauth.generateAuthUrl({
      scope: ["identify"],
      state: crypto.randomBytes(16).toString("hex"),
    });
    console.log(url);
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