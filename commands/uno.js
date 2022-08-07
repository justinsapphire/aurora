const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uno')
		.setDescription('Start an UNO game! (Not functional yet)'),
	async execute(interaction) {
		const message = await interaction.reply({ 
            content: 'Click ✅ to join the game!', 
            fetchReply: true 
        });
		message.react('✅').catch(error => console.error('Failed to react with checkmark', error));
        
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('startUno')
                    .setLabel('Start')
                    .setStyle(ButtonStyle.Success),
            );

        await interaction.followUp({
            content: 'Click **Start** to start this game!',
            ephemeral: true,
            components: [row]
        })
	},
};
