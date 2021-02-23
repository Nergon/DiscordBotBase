const {prefix} = require('../config.json')
const discord = require('discord.js')

module.exports = {
    name: 'help',
    description: 'Lists all available commands',
    execute(message, args) {
        const {commands} = message.client

        const embed = new discord.MessageEmbed()
            .setTitle("Help")
            .setDescription("List of all available commands")
            .setColor('BLUE');

        commands.forEach((command, name) => {
            embed.addField(`${prefix}${name}`, command.description);
        });


        message.author.send(embed);
    },
};