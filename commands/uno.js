const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

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
        const messageId = message.id;

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`startUno: ${messageId}`)
                    .setLabel('Start')
                    .setStyle(ButtonStyle.Success),
            );

        const hostMessage = await interaction.followUp({
            content: 'Click **Start** to start this game!',
            ephemeral: true,
            components: [row],
            fetchReply: true
        })

        const collector = hostMessage.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });
        let startCheck = false;

        collector.on('collect', async i => {
            // Start is clicked

            //Game cannot start cases:

            //Game is starting cases:
            startCheck = true;
            await i.update({
                content: 'The Game has Started!',
                ephemeral: true,
                components: []
            });
            let peopleInGame = [];
            const userReactions = message.reactions.cache.filter(reaction => !reaction.users.cache.has(interaction.client.user.id));
            console.log(userReactions);
        });

        collector.on('end', async collected => {
            if(!startCheck) {
                //Timed out
                await interaction.editReply('The game has timed out.')
            }
        });


	},
};
