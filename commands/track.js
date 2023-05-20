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
        ),
	async execute(interaction) {
        const id = interaction.options.getString('id') ?? 'No Valorant IGN provided';
        const tag = interaction.options.getString('tag') ?? 'No Valorant Tag provided';
        const region = interaction.options.getString('region') ?? 'na';

        await interaction.deferReply();
        const alertData = fs.readFileSync('./alerts.json');
	    const alerts = JSON.parse(alertData);
	},
};