const {prefix} = require('../config.json');

module.exports = {
    name: 'ready',
    once: false,
    execute(client) {
        console.log('Started Escrow bot');
        console.log(`Logged in as ${client.user.tag}`);
        client.user.setPresence({activity: {name: `${prefix}help`, type: "PLAYING"}})
    }
}