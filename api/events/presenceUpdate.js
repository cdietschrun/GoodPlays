import { Events } from 'discord.js';
import db from '../connections/mongo.js';
import util from 'util';
import { request } from 'undici';

async function test(userId, activity, isStart) {
  try {
    console.log(activity);
    const haiku = db.collection("game_play");
    
    //const options = { upsert: true };
    
    // create a document to insert
    if (isStart)
    {
      const play = {
        userId: userId,
        gameName: activity.name,
        startTimestamp: activity.timestamps.start,
        endTimestamp: null
      }

      const result = await haiku.insertOne(play);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
    }
    else
    {
      
      const filter = { userId: userId, gameName: activity.name };
      
      const updatePlay = {
        $set: {
           endTimestamp: new Date()     
        },
      };
      
      const result = await haiku.updateOne(filter, updatePlay);
      console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
    }
  } finally {
    
  }
};

async function roles()
{
  ///guilds/{guild.id}/members/{user.id}a
              const userResult = await request(`https://discord.com/api/guilds/1120487483889684490/members/131989430171992064`, {
          headers: {
            authorization: `Bot ${process.env.BOT_TOKEN}`,
          },
        });
  console.log(await userResult.body.json());
}

const presenceUpdate = {
	name: Events.PresenceUpdate,
	once: false,
	execute (old, new1) {
		//console.log(`presence s ${old}, ${new1}`);
    //console.log(util.inspect(old, false, null, true));
    //console.log(util.inspect(new1, false, null, true));
    //const oldActivity = old.activities[0];
    //const newActivity = new1.activities[0];
  
    //roles(new1.userId);
    console.log(old.activities);
    console.log(new1.activities);
    console.log(new1);
    
    if (!old.activities.length && new1.activities.length > 0)
      {
        console.log('game start');
        test(new1.userId, new1.activities[0], true);
      }
    else if (old.activities.length > 0 && !new1.activities.length)
      {
        console.log('game end');
        test(new1.userId, old.activities[0], false);
      }
    //test(new1);
	},
};

export default presenceUpdate;