const {prefix: globalPrefix} = require('./config.json');
const discord = require('discord.js');
const {Prefix} = require('./database');
const guildPrefixes = {};

const validatePermissions = (permissions) => {
    const validPermissions = [
        'ADMINISTRATOR',
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS'
    ]

    for(const permission of permissions) {
        if(!validPermissions.includes(permission)) {
            throw new Error(`Permission ${permission} unknown`)
        }
    }
}

module.exports.handleCommand = (message, client) => {

    const prefix = (message.guild) ? (guildPrefixes[message.guild.id] || globalPrefix) : globalPrefix;

    if(!message.content.startsWith(prefix || message.author.bot)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if(!client.commands.has(commandName)) {
        const errorEmbed = new discord.MessageEmbed()
            .setColor('RED')
            .setTitle('Command not found')
            .setDescription(`This command does not exist. Try ${prefix}help for a list of commands`)
        message.channel.send(errorEmbed);
        return;
    }

    const command = client.commands.get(commandName)

    if(command.guildOnly && message.channel.type === 'dm') {
        const errorEmbed = new discord.MessageEmbed()
            .setColor('RED')
            .setTitle('You can\'t execute this command inside dm');
        message.channel.send(errorEmbed);
        return;
    }

    if(command.permissions.length) {
        let permissions = command.permissions;
        if(typeof command.permissions === 'string') {
            permissions = [command.permissions];
        }

        validatePermissions(permissions)

        const missingPermissionEmbed = new discord.MessageEmbed()
            .setTitle('Not allowed')
            .setDescription('You are not allowed to run this command')
            .setColor('RED');

        const authorPerms = message.channel.permissionsFor(message.author);

        if(!authorPerms) {
            message.channel.send(missingPermissionEmbed);
            return;
        }

        for(const permission of permissions) {
            if(!authorPerms.has(permission)) {
                message.channel.send(missingPermissionEmbed);
                return;
            }
        }
    }

    if(args.length < command.minArgs || args.length > command.maxArgs) {
        const invalidUsageEmbed = new discord.MessageEmbed()
            .setTitle('Invalid number of arguments')
            .setDescription(`You didn\'t provide the correct number of arguments. The correct usage would be ${prefix} ${command.usage}`);
        message.channel.send(invalidUsageEmbed);
        return;
    }

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

module.exports.reloadPrefix = (guildId) => {
    Prefix.findByPk(guildId).then(result => {
        if(result !== null) {
            guildPrefixes[guildId] = result.prefix;
        }
    })
}

module.exports.getPrefix = (guildId) => {
    return guildPrefixes[guildId] || globalPrefix;
}