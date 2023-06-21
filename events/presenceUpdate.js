import { Events } from 'discord.js';
import db from '../connections/mongo.js';
import util from 'util';

async function test(activity) {
  try {
    console.log(activity);
    const haiku = db.collection("game_play");
    // create a document to insert
    const play = {
      gameName: activity.name,
      timestamp: activity.timestamps.start
    }
    const result = await haiku.insertOne(play);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    
  }
};

const presenceUpdate = {
	name: Events.PresenceUpdate,
	once: false,
	execute (old, new1) {
		//console.log(`presence s ${old}, ${new1}`);
    //console.log(util.inspect(old, false, null, true));
    //console.log(util.inspect(new1, false, null, true));
    //const oldActivity = old.activities[0];
    //const newActivity = new1.activities[0];
    console.log(old.activities);
    console.log(new1.activities);
    
    if (!old.activities.length && new1.activities.length > 0)
      {
        console.log('game start');
        test(new1.activities[0]);
      }
    else if (old.activities.length > 0 && !new1.activities.length)
      {
        console.log('game end');
      }
    //test(new1);
	},
};

export default presenceUpdate;