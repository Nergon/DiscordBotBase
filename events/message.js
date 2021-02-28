const { prefix } = require('../config.json');
const discord = require('discord.js');
const commandBase = require('../commandBase');

module.exports = {
    name: 'message',
    once: false,
    execute(message, client) {
        commandBase.handleCommand(message, client);
    }
}
