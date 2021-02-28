const {prefix} = require('../config.json')
const discord = require('discord.js')
const {Prefix} = require('../database');
const commandBase = require('../commandBase');

module.exports = {
    name: 'prefix',
    description: 'Set the prefix of the bot',
    minArgs: 1,
    maxArgs: 1,
    usage: '<prefix>',
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    guildOnly: true,
    execute(message, args) {
        const newPrefix = args[0];

        if(newPrefix.length > 5) {
            const errorEmbed = new discord.MessageEmbed()
                .setTitle('New prefix to long')
                .setDescription('New prefix cannot be longer than 5 chars')
                .setColor('RED');

            message.channel.send(errorEmbed);
            return;
        }

        Prefix.upsert({
            guild_id: message.guild.id,
            prefix: newPrefix
        });

        commandBase.reloadPrefix(message.guild.id);

        const embed = new discord.MessageEmbed()
            .setTitle('Prefix updated')
            .setDescription(`Your prefix was successfully updated. The new prefix is \`${newPrefix}\``)
            .setColor('GREEN');

        message.channel.send(embed)

    },
};