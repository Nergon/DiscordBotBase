const {prefix} = require('../config.json');
const commandBase = require('../commandBase');

module.exports = {
    name: 'ready',
    once: false,
    execute(client) {
        console.log('Started bot');
        console.log(`Logged in as ${client.user.tag}`);
        client.user.setPresence({activity: {name: `${prefix}help`, type: "PLAYING"}})
        commandBase.loadPrefixes(client);
    }
}
