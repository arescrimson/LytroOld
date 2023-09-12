require('dotenv').config();

const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`${c.user.tag + " is ready."}`)
})

client.on('messageCreate', async (message) => {

    if (message.author.bot) return

    
})


client.login(process.env.TOKEN);

