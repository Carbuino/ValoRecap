const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { CronJob } = require('cron');
const { scrapeJSON } = require('./js/create_image/create_image')
const fs = require('node:fs');
const path = require('node:path');
require('log-timestamp');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

let getPlayedMatches = new CronJob('*/5 * * * *', async () => {
	console.log(`Checking Alerts`);
	const alertData = fs.readFileSync('./alerts.json');
	const alerts = JSON.parse(alertData);
	if (alerts.hasOwnProperty(0)) {
		for (let i = 0; i < alerts.length; i++) {
			let alert = alerts[i];
			try {
				var matchResults = await scrapeJSON(alert.name, alert.tag, alert.region, alert.match_id, alert.puuid);
			} catch (err) {
				console.error(`Error getting match data for ${alert.name}#${alert.tag}\n${err}`);
				continue;
			};
			let image = matchResults.image;
			let matchID = matchResults.match;
			if ( image !== false ) {
			console.log(`Posting New Results Image for ${alert.name}#${alert.tag}`);
			alert.match_id = matchID;
			alert.channel_id.forEach(async channel => {
				const mailBox = await client.channels.fetch(channel);
				mailBox.send({
					content: `${alert.name}#${alert.tag} finished a game of Valorant!`,
					files: [{
						attachment: image,
						name: `${alert.name}#${alert.tag}_match_result.png`
						}]
					});
				});
			};
		};
	console.log('Writing updated alerts.json...')
	fs.writeFileSync('./alerts.json', JSON.stringify(alerts, null, 4));
	console.log('----- Alerts Cron process complete -----')
	} else {
		fs.writeFileSync('./alerts.json', '[]');
	};
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	getPlayedMatches.start()
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Log in to Discord with your client's token
client.login(token);
