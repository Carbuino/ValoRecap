const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const guns = ["Stinger", "Spectre", "Bucky", "Judge", "Bulldog", "Guardian", "Phantom", "Vandal", "Marshal", "Operator", "Ares", "Odin"];
const sidearms = ["Classic", "Shorty", "Frenzy", "Ghost", "Sheriff"];


module.exports = {
	data: new SlashCommandBuilder()
		.setName('loadout')
		.setDescription('Generate a gun loadout'),
	async execute(interaction) {
    await interaction.deferReply();
    let firstGun = guns[Math.floor(Math.random()*guns.length)];
    let secondGun = firstGun;
    while ( secondGun === firstGun ) {
      secondGun = guns[Math.floor(Math.random()*guns.length)];
    };
    let sideGun = sidearms[Math.floor(Math.random()*sidearms.length)];
		const gunEmbed = new EmbedBuilder()
            .setColor(0xC3B2FF)
            .setTitle('Valorant Loadout Randomizer')
            .setThumbnail('https://cdn.discordapp.com/emojis/742848427221581917.webp')
            .addFields(
                { name: 'Gun 1', value: firstGun, inline: true },
                { name: 'Gun 2', value: secondGun, inline: true },
                { name: 'Sidearm', value: sideGun, inline: true }
            )
            .setTimestamp()
    await interaction.editReply({
        embeds: [gunEmbed]
    });
	},
};