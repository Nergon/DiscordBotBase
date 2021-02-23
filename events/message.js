const { prefix} = require('../config.json');

module.exports = {
    name: 'message',
    once: false,
    execute(message, client) {
        if(!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split('/ +/');
        const commandName = args.shift().toLowerCase();

        if(!client.commands.has(commandName)) {
            const errorEmbed = new discord.MessageEmbed()
                .setColor('RED')
                .setTitle('Command not found')
                .setDescription(`This command does not exist. Try ${config.prefix}help for a list of commands`)
            message.reply(errorEmbed);
            return;
        }

        const command = client.commands.get(commandName)

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
}