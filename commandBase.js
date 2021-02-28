const {prefix: globalPrefix} = require('./config.json');
const {Prefix} = require('./database');
const guildPrefixes = {};

module.exports.handleCommand = (message, client) => {

    const prefix = (message.guild) ? (guildPrefixes[message.guild.id] || globalPrefix) : globalPrefix;

    if(!message.content.startsWith(prefix || message.author.bot)) return;

    const args = message.content.slice(prefix.length).trim().split('/ +/');
    const commandName = args.shift().toLowerCase();

    if(!client.commands.has(commandName)) {
        const errorEmbed = new discord.MessageEmbed()
            .setColor('RED')
            .setTitle('Command not found')
            .setDescription(`This command does not exist. Try ${prefix}help for a list of commands`)
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
};

module.exports.loadPrefixes = (client) => {
    for(const guild of client.guilds.cache) {
        Prefix.findByPk(guild[1].id).then(result => {
           if(result !== null) {
               guildPrefixes[guild[1].id] = result.prefix;
           }
        });
    }
}