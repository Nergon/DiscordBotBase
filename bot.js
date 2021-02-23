const discord = require('discord.js');
const fs = require('fs');
const bitcoin = require('bitcoinjs-lib');
const client = new discord.Client();
const config = require('./config.json');

client.commands = new discord.Collection();

/**
 * Load Commands
 */

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command);
}

/**
 * Load events
 */

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args, client))
    } else {
        client.on(event.name, (...args) => event.execute(...args, client))
    }
}


client.login(config.token);
