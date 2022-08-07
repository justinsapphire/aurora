module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isButton()) return;
        // Event Handler for Button Click!
		// Better handled within the command using collections.
	    //console.log(interaction);
	},
};
