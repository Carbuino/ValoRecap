const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('agent')
		.setDescription('Randomly choose an Agent')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Agent Type')
                .setRequired(true)
                .addChoices(
                    { name: 'Controller', value: 'Controller' },
                    { name: 'Duelist', value: 'Duelist' },
                    { name: 'Initiator', value: 'Initiator' },
                    { name: 'Sentinel', value: 'Sentinel' },
                    { name: 'All', value: 'All' },
        )),
	async execute(interaction) {
        await interaction.deferReply();
        const agentType = interaction.options.getString('type') ?? 'No Agent Type was provided';
        let agentInfo = [];
		let response = await fetch(`https://valorant-api.com/v1/agents?isPlayableCharacter=true`);
        let data = await response.json();
        data.data.forEach(element => {
            if ( agentType !== 'All' ) {
                if ( agentType === element.role.displayName ) {
                    agentInfo.push([element.displayName, element.role.displayName, element.displayIcon])
                };
            } else {
                agentInfo.push([element.displayName, element.role.displayName, element.displayIcon])
            }
         })
        let selectedAgent = agentInfo[Math.floor(Math.random()*agentInfo.length)];
        const agentEmbed = new EmbedBuilder()
            .setColor(0xC3B2FF)
            .setTitle('Valorant Agent Randomizer')
            .setThumbnail(selectedAgent[2])
            .addFields(
                { name: selectedAgent[0], value: selectedAgent[1] },
            )
            .setTimestamp()
        await interaction.editReply({
            embeds: [agentEmbed]
        });
	},
};