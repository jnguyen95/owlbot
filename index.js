const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("message", async message => {
	if(message.author.bot) return;

	if(message.content.indexOf(config.prefix) !== 0) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ %/g);
	const command = args.shift().toLowerCase();

	if(command === "test") {
		message.channel.send("Hoot hoot!");
	}
});

client.login(config.token);
