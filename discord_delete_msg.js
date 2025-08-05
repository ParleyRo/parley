// const { Client, GatewayIntentBits } = require('discord.js');

// const client = new Client({
//     intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
// });

// const TOKEN = 'MTMzNTk3MDI3ODQ5MjA4MjIwOA.GE0z34.yaDqHPJesVeuc2F3jC7zyRRrag5GhBM0T7b56c';
// const CHANNEL_ID = '1334450462337925150';

// client.once('ready', async () => {
//     console.log(`Logged in as ${client.user.tag}`);

//     const channel = await client.channels.fetch(CHANNEL_ID);
//     let messages;

//     do {
//         messages = await channel.messages.fetch({ limit: 100 }); // Fetch max 100 messages

//         console.log(messages.size + " messages fetched, deleting...");
//         const result = await channel.bulkDelete(messages);
        
//     } while (messages.size > 0);

//     console.log("All messages deleted!");
//     process.exit(); // Exit script
// });

// client.login(TOKEN);

// return;