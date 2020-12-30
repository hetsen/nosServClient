/*
[
	{
		"serverIP":"http://creftan.com:8082"
	},
	{
		"serverName":"EU-3",
		"serverPath":"nosgoth\\Binaries\\Win32\\Nosgoth.exe"
	},
	{
		"serverName":"EU-4",
		"serverPath":"nosgoth-se2\\Binaries\\Win32\\Nosgoth.exe"
	},
	{
		"serverName":"EU-5",
		"serverPath":"nosgoth-se3\\Binaries\\Win32\\Nosgoth.exe"
	}
]
*/

const fs 			= require('fs');
var path 			= require("path");
var socket 			= require('socket.io-client')
const { exec } 		= require('child_process');

console.log('Looking for server.json');
function serverFileFunc(item, index){
	if (item.serverName == undefined || item.serverPath == undefined) {

	} else {
		console.log(item.serverName + " - " + item.serverPath+"\n");
	}

}

var servers;
try {
	servers = JSON.parse(fs.readFileSync(path.join(process.cwd(),'\\conf\\servers.json')));
	var io = new socket.connect(servers[0].serverIP,{'forceNew':true});
	console.log("Server IP: "+servers[0].serverIP+"\n");
	servers.forEach(serverFileFunc);
} catch (err) {
	console.log("Cannot find servers.json or servers.json is broken then restart the client.");
}

io.on('connect', function(){
	console.log('connected');
});
io.on('event', function(data){
	console.log(data);
});
io.on('disconnect', (reason) => {
  console.log('disconnected');
  console.log(reason + ". Reconnecting!")
  if (reason === 'io server disconnect') {
    io.connect();
  }
});

var newServerLength = servers.length-1;

io.on('message', function(msg){
	servers.forEach(function(item,index){
		if(msg[0] === item.serverName){
			console.log("Restarting: "+item.serverName);
			exec('Get-Process "Nosgoth" | Where-Object {$_.Path -like "*'+item.serverPath+'"} | Stop-Process', {'shell':'powershell.exe'}, (error, stdout, stderr)=> {
				console.log("PowerShell stdout: " +stdout+"\n");
				console.log("PowerShell error: " +error+"\n");
				console.log("PowerShell stderr: " +stderr+"\n");
			})
		} else {
			if(index == newServerLength) {
				console.log("Requested restart for: "+msg[0]);
			}
		}
	})
});
io.on('error', function(err){
	console.log(err);
})