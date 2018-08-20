const Discord = require("discord.js");
const rbx = require("roblox-js");
const fs = require("fs");
const bot = new Discord.Client();
const https = require("https");
const db = require("quick.db");
var prefix = 'b!'
var shouts = ["lol","ciastko","roblox","bloxpolska","polska"];
const savedData = fs.readFileSync("./RobloxIds.json");
var RbxIds = JSON.parse(savedData);
var TempIds = [];
var Words = [];
var LVLroles = ["Nowy w pisaniu[1-3 poziom]","Doświadczony w pisaniu[4-7 poziom]"];
var MINroles = [1,4,8];
var Poziomy = [20,50,100];
const ExistRoles = fs.readFileSync("./ExistRoles.json");
var ERole = JSON.parse(ExistRoles);
var number = 0;

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();





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
	
setTimeout(ChceckStatus,100000);

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
	
		
            

		
        client.query(`SELECT * FROM Poziomy WHERE UserID="${msg.author.id}"`, (err,res) => {
  		if (err){
			client.query(`INSERT INTO Poziomy (UserID, MSG, LVL) VALUES (${msg.author.id}, 0,0);`, (err) => {
			if (err) throw err;
			});
		
		}
		console.log(res);

	});
 	 

	if (!Command.startsWith(prefix)){ 
		
	 
        db.add(`Wiadomosci_${msg.author.id + msg.guild.id}`, 1).then(i => { 
           

            let messages; 
            if (i == 20) messages = 20; 
            else if (i == 50) messages = 50; 
            else if (i == 100) messages = 100;

            if (!isNaN(messages)) { // If messages IS STILL empty, run this.
                db.add(`userLevel_${msg.author.id + msg.guild.id}`, 1).then(o => {
			var NRG = false;
		    MINroles.forEach(function(value,index){
			    console.log(value);
		    	if(o === value){
				let RoleToAdd = msg.guild.roles.find(r => r.name === LVLroles[index]);
				LVLroles.forEach(function(value,index){
				
					let roleToRemove = msg.guild.roles.find(r => r.name === LVLroles[index]);
					if(roleToRemove){
						msg.member.removeRole(roleToRemove);
					};
					
				});
				msg.member.addRole(RoleToAdd);
				NRG = true;
			}
		    });
			if(NRG === true){
			 msg.reply(`Właśnie osiągnąłeś/aś ${o} poziom w pisaniu i otrzymałeś/aś nowy tytuł!`); // Send their updated level to the channel.
			}else{
			 msg.reply(`Właśnie osiągnąłeś/aś ${o} poziom w pisaniu!`); // Send their updated level to the channel.
			}
                   
                })
            }

        })	
		
		
	return;}
	
	if(Command === `${prefix}poziom`){
		db.fetch(`userLevel_${msg.author.id + msg.guild.id}`).then(lvl => {
		
			db.fetch(`Wiadomosci_${msg.author.id + msg.guild.id}`).then(i => {
				console.log(i);
				if(!lvl) lvl = 0;
				if(!i) return msg.reply(`Nie wysłałeś/aś żadnej wiadomości. Komendy się nie liczą do wiadomości`);
				msg.reply(`Aktualnie posiadasz poziom `+lvl+`. `+i+`/`+Poziomy[lvl]+` do następnego poziomu.`);
			
			});
		
		});
	}
	
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
