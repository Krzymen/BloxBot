const Discord = require("discord.js");
const rbx = require("roblox-js");
const fs = require("fs");
const bot = new Discord.Client();
const https = require("https");
var prefix = 'b!'
var shouts = ["lol","ciastko","roblox","bloxpolska","polska"];
const savedData = fs.readFileSync("./RobloxIds.json");
var RbxIds = JSON.parse(savedData);
var TempIds = [];
var Words = [];

const ExistRoles = fs.readFileSync("./ExistRoles.json");
var ERole = JSON.parse(ExistRoles);
var number = 0;

function count(value, index, array){

	number = number  + 1;

}


function ChceckStatus(){

rbx.getPlayers(4014821).then(function(group){
		
		number = 0;
		
		
		var numbers = group.players;
		
		numbers.forEach(count);
		
		
		bot.user.setGame('Nasza grupa ma już ' +number+" members!");
	});
	
setTimeout(ChceckStatus,600000);

}


bot.on("ready",function(){
	console.log("Gotowy!");
	ChceckStatus();
	
	
})

//function autoUpdateRole()
//{
//	if(guild.available){
//		var members = guild.members;
//		var membersArray = array.from(members.values());
//	}
//}


bot.on("message",async msg => {
	if (msg.author.bot) return;
	if (msg.channel.type == "dm") msg.channel.send("Sorki ale nie odpowiadam na priv.");
	if (msg.content == "Sorki ale nie odpowiadam na priv.") return;
	let MessageArray = msg.content.split(" ");
	let Command = MessageArray[0];
	let Args = MessageArray.slice(1);
	
	let msgFiles = msg.attachments;
	let msgFilesArray = msgFiles.array();
	let i = 0;
	msgFilesArray.forEach(function(item, index){
		
		const options = {
		
		 hostname: 'www.virustotal.com',
 		 port: 443,
 		 path: '/vtapi/v2/url/scan',
 		 method: 'POST',
		 headers: {
       			'apikey': process.env.VT_API_KEY,
       			'url': item.url
		 }
    		 };
		
		var req = https.request(options, function(res) {
			res.on("data", function(data){
				console.log(data);
			});
		});
		
		req.on("error", function(err){
			console.log(err);
		});

		const options = {
		
		 hostname: 'www.virustotal.com',
 		 port: 443,
 		 path: '/vtapi/v2/url/report?apikey='+process.env.VT_API_KEY+'>&resource='+item.url,
 		 method: 'GET',
    		 };
		
		var req = https.request(options, function(res) {
			res.on("data", function(data){
				console.log(data);
			});
		});
		
		req.on("error", function(err){
			console.log(err);
		});
	});
		
            
 		
		
        
 	 

	if (!Command.startsWith(prefix)) return;
	
	
	const member = msg.guild.member(msg.author);
	if(!member.roles.find(val => val.name === 'Zweryfikowany')){
		if(Command === `${prefix}powiaz`){
			console.log(RbxIds[msg.author.id]);
			if(!RbxIds[msg.author.id]){
				if(!Args[0]) return msg.channel.send("Proszę podać nazwe użytkownika na ROBLOX");
				if(Args[0]){
					rbx.getIdFromUsername(Args[0]).then(function(id){
						let word = Math.floor((Math.random() * 5));
						TempIds[msg.author.id] = id;
						Words[msg.author.id] = shouts[word];
						console.log(Words[msg.author.id]);
						msg.channel.send(`Znaleziono użytkownika! Teraz aby dokończyć werifikacje napisz w swoim opisie ${shouts[word]}. Gdy już to zrobisz wpisz b!ok.`);
					}).catch(function(err){ 
						msg.channel.send(`Użytkownik ${Args[0]} nie istnieje na ROBLOX.`);

					});
				}	
			}else{
				msg.channel.send(`To konto jest już powiązane z kontem na ROBLOX`);
			}
		}

		if(Command === `${prefix}ok`){
			if (TempIds[msg.author.id] > 0){
				var OK = false;

				rbx.getBlurb(TempIds[msg.author.id]).then(function(rank){
					var check = rank.indexOf(Words[msg.author.id]);
					console.log(Words[msg.author.id]);
					console.log(check);
					if (check > -1){
						OK = true;
						if(OK === true){
							fs.writeFile("./RobloxIds.json", JSON.stringify(RbxIds),success);
						function success(err){
							if(!err){
								msg.channel.send("Zwerifikowano pomyślnie.");
								RbxIds[msg.author.id] = TempIds[msg.author.id];
								let role = msg.guild.roles.find(r => r.name === "Zweryfikowany");
								let ToVerify = msg.member;
								ToVerify.addRole(role);
								rbx.getRankInGroup(4014821,RbxIds[msg.author.id]).then(function(rank){
									console.log(rank);
									if (rank == 2){
									let role = msg.guild.roles.find(r => r.name === "Członek");
										if(role){
											ToVerify.addRole(role);
										}
									}
									if (rank == 10){
									let role = msg.guild.roles.find(r => r.name === "Aktywny Członek");
										if(role){
											ToVerify.addRole(role);
										}
									}
									if (rank == 12){
									let role = msg.guild.roles.find(r => r.name === "Członek Miesiąca");
										if(role){
											ToVerify.addRole(role);
										}
									}
									if (rank == 13){
									let role = msg.guild.roles.find(r => r.name === "Konkursowicz");
										if(role){
											ToVerify.addRole(role);
										}
									}
									if (rank == 16){
									let role = msg.guild.roles.find(r => r.name === "Partner Grupy");
										if(role){
											ToVerify.addRole(role);
										}
									}
									if (rank == 19){
									let role = msg.guild.roles.find(r => r.name === "Zaufany członek");
										if(role){
											ToVerify.addRole(role);
										}
									}
									if (rank == 20){
									let role = msg.guild.roles.find(r => r.name === "Stały członek");
										if(role){
											ToVerify.addRole(role);
										}
									}
										
										
										
										
									rbx.getUsernameFromId(RbxIds[msg.author.id]).then(function(nick){
										if(nick){
											try{
												msg.member.setNickname(msg.author.username + '['+nick+']');
											}catch(err){
												console.log(err);
												}
											}
									});

									
									
								});
							}else{
								msg.channel.send("Wystąpił bład z weryfikacją :/");
							}
						}
						}else{
							msg.channel.send("Nie udało się zweryfikować. Użyj komendy b!powiaz.");
						}
					}
				});	
			}else{
				msg.channel.send("Użyj komendy b!powiaz.");
			}
		}
	}
})

bot.login(process.env.BOT_TOKEN);
