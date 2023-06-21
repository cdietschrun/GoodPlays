import { Events } from 'discord.js';
import util from 'util';

const presenceUpdate = {
	name: Events.PresenceUpdate,
	once: false,
	execute(old, new1) {
		console.log(`presence s ${old}, ${new1}`);
    console.log(util.inspect(old, false, null, true));
    console.log(util.inspect(new1, false, null, true));
	},
};

export default presenceUpdate;