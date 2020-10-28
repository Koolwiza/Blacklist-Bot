const db = require('quick.db')
const Discord = require('discord.js')
const fs = require('fs')
const colors = require('./colors.json')
const client = new Discord.Client()
const config = require('./config.json')
const chalk = require('chalk')

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

client.commands = new Discord.Collection()


// Bot Code //

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log('Ready!')
})

client.on('message', async message => {
    if (!message.content.startsWith(config.PREFIX)) return;


    const args = message.content.slice(config.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    let checkingBlacklistedMembers = db.fetch(`blacklisted_${message.author.id}`)
    if (checkingBlacklistedMembers === null) {
        checkingBlacklistedMembers === false
    }


    let blacklistedEmbed = new Discord.MessageEmbed()
        .setTitle("YOU HAVE BEEN BLACKLISTED")
        .setColor(colors.red)
        .setDescription("You have been blacklisted from my commands. If you wish to appeal, please DM <@"+ config.DMtoUnbanID +"> for more info.")
        .setFooter(`${client.user.username}`, client.user.avatarURL())

    if (checkingBlacklistedMembers === true) return message.channel.send(blacklistedEmbed)

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    try {
        command.execute(message, args, client);
        console.log(chalk.greenBright('[COMMAND]'), `${message.author.tag} used the command ` + commandName)
    } catch (error) {
        console.log(error);
        message.reply('there was an error trying to execute that command! ```\n' + error + "\n```");
    }
})

client.login(config.token)

