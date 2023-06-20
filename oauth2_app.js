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

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

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
      'grant_type': 'client_credentials',
      'code': req.query.code,
      'redirect_uri': `https://nostalgic-pollen-antimatter.glitch.me/redirect`,

      'scope': 'identify connections'
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
  
    const applicationRoleResult = await request('https://discord.com/api/users/@me/applications/3574075655784062989/role-connection', {
    headers: {
      authorization: `${discord_data.token_type} ${discord_data.access_token}`,
    },
  });
  
  console.log(await applicationRoleResult.body.json());
  
  response.send('heyy');
});

app.listen(PORT, () => {
  console.log('Listening on 1port', PORT);
});
