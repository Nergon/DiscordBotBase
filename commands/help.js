const {prefix: globalPrefix } = require('../config.json');
const discord = require('discord.js');
const commandBase = require('../commandBase');

module.exports = {
    name: 'help',
    description: 'Lists all available commands',
    minArgs: 0,
    maxArgs: 0,
    usage: '',
    permissions: [],
    requiredRoles: [],
    guildOnly: false,
    execute(message, args) {
        const {commands} = message.client

        const prefix = (message.channel.type === 'dm') ? globalPrefix : commandBase.getPrefix(message.guild.id);

        const embed = new discord.MessageEmbed()
            .setTitle("Help")
            .setDescription("List of all available commands")
            .setColor('BLUE');

        commands.forEach((command, name) => {
            embed.addField(`${prefix}${name} ${command.usage}`, command.description);
        });


        message.author.send(embed);
    },
};