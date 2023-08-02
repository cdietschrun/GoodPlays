import { Events } from 'discord.js';
import db from '../connections/mongo.js';

let activeGames= {};

async function test(userId, activity, isStart) {
  try {
    console.log(activity);
    const haiku = db.collection("game_play");
    
    //const options = { upsert: true };
    const activityName = activity.name.replace(':', '').replace('™', '');
    
    // create a document to insert
    if (isStart)
    {
      const play = {
        userId: userId,
        gameName: activityName,
        startTimestamp: activity.timestamps.start,
        endTimestamp: null
      }

      const result = await haiku.insertOne(play);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      activeGames[userId] = result.insertedId;
    }
    else
    {
      const filter = { userId: userId, gameName: activityName, _id: activeGames[userId] };
      console.log(filter);
      
      const updatePlay = {
        $set: {
           endTimestamp: new Date()
        },
      };
      
      const result = await haiku.updateOne(filter, updatePlay);
      console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
      activeGames[userId] = null;
    }
  } finally {
    
  }
};

const presenceUpdate = {
	name: Events.PresenceUpdate,
	once: false,
	execute (old, new1) {
		
    if (old && !old.activities.length && new1 && new1.activities.length > 0)
      {
        if (new1.activities[0].type == 0){
          console.log('game start');
          test(new1.userId, new1.activities[0], true);
        }
      }
    else if (old && old.activities.length > 0 && new1 && !new1.activities.length)
      {
        if (old.activities[0].type == 0){
          console.log('game end');
          test(new1.userId, old.activities[0], false);
        }
      }
    //test(new1);
	},
};

export default presenceUpdate;