const { SlashCommandBuilder } = require('discord.js');
const { scrapeJSON } = require('../generate_image/js/create_image');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('result')
		.setDescription('Get Match Results'),
	async execute(interaction) {
        await interaction.deferReply();
        var imageData = await scrapeJSON('46ebb91a-a3d7-5143-8b55-78296eefbd1f', 'Carbon', '099', 'na');
		await interaction.editReply({
            files: [{
              attachment: imageData,
              name: 'match_result.png'
            }]
          });
	},
};
