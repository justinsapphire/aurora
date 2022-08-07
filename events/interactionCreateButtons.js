module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isButton()) return;
        // Event Handler for Button Click!

	    console.log(interaction);
	},
};
