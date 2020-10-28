const Discord = require('discord.js')
const colors = require('../colors.json')
const client = require('../index.js')
const db = require('quick.db')
const config = require('../config.json')

module.exports = {
    name: 'ping',
    
    async execute(message, args) {
        message.channel.send('pong')
    }
}