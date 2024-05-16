import { Events } from 'discord.js';
import db from '../connections/mongo.js';

let activeGames= {};

export async function startOrEndGame(userId, activity, isStart) {
  try {
    console.log(activity);
    const gamePlays = db.collection("game_play");
    
    const activityName = activity.name.replace(':', '').replace('™', '');

    // create a document to insert
    if (isStart)
    {
      const play = {
        userId: userId,
        gameName: activityName,
        startTimestamp: activity.timestamps ? activity.timestamps.start : new Date(),
        endTimestamp: null
      }

      const result = await gamePlays.insertOne(play);
      console.log(`[${new Date().toString()}] A document was inserted with the _id: ${result.insertedId}`);
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
      
      const result = await gamePlays.updateOne(filter, updatePlay);
      console.log(`[${new Date().toString()}] ${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
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
      if ((new1.activities[0].name == 'PCSX2' || 
           new1.activities[0].name == 'DuckStation' ||
           new1.activities[0].name == 'RPCS3') && new1.activities[0].details == 'No Game Running')
      {
        console.log(new1.activities[0].name + ': no game running');
        return;
      }

      if (new1.activities[0].type == 0)
      {
        console.log('game start');
        startOrEndGame(new1.userId, new1.activities[0], true);
      }
    }
    else if (old && old.activities.length
      && (old.activities[0].name == 'PCSX2' || 
         old.activities[0].name == 'DuckStation' ||
         old.activities[0].name == 'RPCS3') 
      && old.activities[0].details == 'No Game Running'
      && new1 && new1.activities.length > 0 
      && (new1.activities[0].name == 'PCSX2' ||
          new1.activities[0].name == 'DuckStation' ||
          new1.activities[0].name == 'RPCS3'))
    {
        new1.activities[0].name = new1.activities[0].details + ' on ' + new1.activities[0].name;
        if (new1.activities[0].type == 0)
        {
          console.log('game start');
          startOrEndGame(new1.userId, new1.activities[0], true);
        }
    }
    else if (old && old.activities.length > 0 && new1 && !new1.activities.length)
    {
      if (old.activities[0].type == 0){
        console.log('game end');
        startOrEndGame(new1.userId, old.activities[0], false);
      }
    }
    else if (old 
      && (old.activities[0].name == 'PCSX2' ||
          old.activities[0].name == 'DuckStation' ||
          old.activities[0].name == 'RPCS3')
       && old.activities[0].details != 'No Game Running'
    && new1 && new1.activities.length > 0
    && (new1.activities[0].name == 'PCSX2' || 
        new1.activities[0].name == 'DuckStation' ||
        new1.activities[0].name == 'RPCS3') 
    && new1.activities[0].details == 'No Game Running')
    {
      old.activities[0].name = old.activities[0].details + ' on ' + new1.activities[0].name;
      if (old.activities[0].type == 0){
        console.log('game end');
        startOrEndGame(new1.userId, old.activities[0], false);
      }
    }
    
	},
};

export default presenceUpdate;