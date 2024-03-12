const run = async (client, interaction) => {
	let user = interaction.options.getUser("user")
	let reason = interaction.options.getString("reason") || "No reason given"

	if (!user) return interaction.reply("You must provide a user to ban")

	// ban
	try {
		await interaction.guild.bans.create(user, {
			reason,
		})
		return interaction.reply(`${user.tag} has been banned for *${reason}*`)
	} catch (e) {
		if (e) {
			console.error(e)
			return interaction.reply(`Failed to ban ${user.tag}`)
		}
	}
}

module.exports = {
	name: "ban",
	description: "禁止使用者存取伺服器",
	perms: "BAN_MEMBERS",
	options: [
		{ name: "user", description: "禁止的用戶", type: "USER", required: true },
		{
			name: "reason",
			description: "處罰理由",
			type: "STRING",
			required: false,
		},
	],
	run,
}
