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
    try {
      var returnData = await scrapeJSON(id, tag, region);
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
      await interaction.editReply({ content: `${id}#${tag} in region ${region} doesn't exist!`, ephemeral: true });
      console.error('error', err)
    };
	}
};