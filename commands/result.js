const { SlashCommandBuilder } = require('discord.js');
const { scrapeJSON } = require('../js/create_image/create_image');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('result')
		.setDescription('Get the last match result')
        .addStringOption(option =>
            option.setName('id')
                    .setDescription('Valorant Name')
                    .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('tag')
                    .setDescription('Valorant Tag')
                    .setRequired(true)
        ),
	async execute(interaction) {
        const id = interaction.options.getString('id') ?? 'No Valorant IGN provided';
        const tag = interaction.options.getString('tag') ?? 'No Valorant Tag provided';

        await interaction.deferReply();
        try {
            var returnData = await scrapeJSON(undefined, undefined, id, tag);
            if ( returnData.image === false ) {
                throw new Error(`${element.name}#${element.tag} - error while generating`);
            };
            await interaction.editReply({
                files: [{
                    attachment: returnData.image,
                    name: `${id}#${tag}_match_result.png`
                }]
            });
        } catch (err) {
            await interaction.editReply({ content: `Error getting data for ${id}#${tag}`, ephemeral: true });
            console.error('error', err)
        };
	}
};