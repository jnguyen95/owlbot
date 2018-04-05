const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const sqlite3 = require("sqlite3").verbose();


let db = new sqlite3.Database('../database/quotes', sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the quote database');
});

let quoteQuery = 'SELECT quote FROM quotes WHERE quote_id = ?';
let insertIntoQuotesQuery = 'INSERT INTO quotes (quote) VALUES (?)';
let deleteQuoteQuery = 'DELETE FROM quotes WHERE quote_id = ?';

client.on("message", async message => {
	if(message.author.bot) return;

	if(message.content.indexOf(config.prefix) !== 0) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	console.log(command);
	console.log(args.join(" "));

	if(command === "test") {
		message.channel.send("Hoot hoot!");
	}

	if(command === "addquote") {
		const quote = args.join(" ");
		console.log(quote);
		db.run(insertIntoQuotesQuery, [quote], function(err) {
			if (err) {
				return console.log(err.message);
			}
			console.log('A row has been inserted with row ID ' + this.lastID + ' and quote ' + quote);
			message.channel.send("Hoot! Successfully added quote " + this.lastID);
		});
	}

	if(command === "quote") {
		const quoteId = args.join(" ");
		if (!quoteId || isNaN(quoteId)) {
			message.channel.send("Hoot! Please send a valid number for me to query!");
			return;
		}

		db.get(quoteQuery, [quoteId], (err, row) => {
			if (err) {
				return console.error(err.message);
			}
			if (row) {
				message.channel.send(row.quote);
			}
			else {
				message.channel.send("Hoot! It appears I can't find this quote you're looking for!");
			}
		});
	}

	if(command === "delquote") {
		const quoteId = args.join(" ");
		if (!quoteId || isNaN(quoteId)) {
			message.channel.send("Hoot! Please send me a valid number to delete a quote from!");
			return;
		}
		db.run(deleteQuoteQuery, [quoteId], (err, row) => {
			if (err) {
				return console.error(err.message);
			}
			message.channel.send("Successfully deleted quote " + quoteId + ".");
		});
	}
});

client.login(config.token);
