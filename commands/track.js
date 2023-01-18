const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('track')
		.setDescription('Add Account to automatically posted Results')
        .addStringOption(option =>
            option.setName('id')
                    .setDescription('Valorant Name')
                    .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('tag')
                    .setDescription('Valorant Tag ')
                    .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('region')
                    .setDescription('Game Region')
                    .setRequired(false)
                    .addChoices(
                        { name: 'NA/LATAM/BR', value: 'na' },
                        { name: 'EU', value: 'eu' },
                        { name: 'AP', value: 'ap' },
                        { name: 'KR', value: 'kr' }
        )),
	async execute(interaction) {
        const id = interaction.options.getString('id') ?? 'No Valorant IGN provided';
        const tag = interaction.options.getString('tag') ?? 'No Valorant Tag provided';
        const region = interaction.options.getString('region') ?? 'na';

        await interaction.deferReply();
        const alertData = fs.readFileSync('./alerts.json');
	    const alerts = JSON.parse(alertData);
	},
};