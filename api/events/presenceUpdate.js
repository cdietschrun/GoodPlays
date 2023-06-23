import { Events } from 'discord.js';
import db from '../connections/mongo.js';

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

const presenceUpdate = {
	name: Events.PresenceUpdate,
	once: false,
	execute (old, new1) {
		
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