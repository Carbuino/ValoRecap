const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { genCode } = require('../js/crosshair/crosshair');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('crosshair')
		.setDescription('Randomly Generate a Crosshair'),
	async execute(interaction) {
    await interaction.deferReply();
    let crosshairCode = genCode();
    const codeEmbed = new EmbedBuilder()
      .setColor(0xC3B2FF)
      .setTitle('Valorant Crosshair Generator')
      .setURL(`https://api.henrikdev.xyz/valorant/v1/crosshair/convert?id=${crosshairCode}`)
      .setThumbnail(`https://api.henrikdev.xyz/valorant/v1/crosshair/generate?id=${crosshairCode.replace('0;p;0;', '0;')}`)
      .addFields(
        { name: 'Profile Code', value: crosshairCode },
      )
      .setTimestamp()
		await interaction.editReply({
      embeds: [codeEmbed]
    });
	},
};