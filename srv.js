const request 		= require('request');
const Discord 		= require('discord.js');
const discclient	= new Discord.Client();
const mysql 		= require('mysql');
const fs 		= require('fs');
var path 		= require("path");

const server = require('http').createServer();

const io = require('socket.io')(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

server.listen(8082);

server.on("connection", (socket) => {	
    console.info('Client connected');
});

discclient.on('ready', () => {
  console.log(`Logged in as ${discclient.user.tag}!`);
}); 

discclient.on('message', msg => {
	var prefix = "!";

	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if (command === 'restart') {
		if(msg.member.roles.cache.some(r=>["Staff","Admin"].includes(r.name))) {
        		msg.reply('restarting ' + args);
        		io.emit('message', args);
		} else {
			msg.reply('U NO ADMIN!');
		}
	} 
})

discclient.login('botIDGoesHere');


