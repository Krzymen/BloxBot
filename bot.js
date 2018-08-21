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
var LVLroles = ["Nowy w pisaniu[1-4 poziom]","Doświadczony w pisaniu[5-8 poziom]","Ekspert w pisaniu[9-15 poziom]","Król pisania[16-24 poziom]","Bóg Pisania[25 poziom]"];
var MINroles = [1,5,9,16,25];
var Poziomy = [20,50,100,200,400,550,800,1100,1500,1850,2300,2800,3350,3950,4600,5400,6050,6850,7700,8700,9550,10550,11600,12700,15000];
const ExistRoles = fs.readFileSync("./ExistRoles.json");
var ERole = JSON.parse(ExistRoles);
var number = 0;
var AntySpamData = [];
var SpamTimeLimit = 1500;
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

/*client.query(`CREATE TABLE Poziomy (UserID BIGINT, MSG BIGINT, LVL INT)`, (err,res) => {
  		if (err) console.log(err);

	});*/

client.query('SELECT * FROM Poziomy;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
});



//client.query(`DELETE FROM Poziomy WHERE userid=358001423562309642`);
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


bot.on("message",async msg => {
	if (msg.author.bot) return;
	if (msg.channel.type == "dm") msg.channel.send("Sorki ale nie odpowiadam na priv.");
	if (msg.content == "Sorki ale nie odpowiadam na priv.") return;
	let MessageArray = msg.content.split(" ");
	let Command = MessageArray[0];
	let Args = MessageArray.slice(1);
	
	if(AntySpamData[msg.author.id]){
	
		if(msg.createdTimestamp - AntySpamData[msg.author.id] < SpamTimeLimit){
			msg.delete();
			msg.reply("coś za szybko piszesz wiadomości. Zwolnij albo poniesiesz konsekwencje (limit czasu pomiędzy wiadomościami: "+SpamTimeLimit/1000+"s ).").then(time => {time.delete(3000);});
		return;
		}
		AntySpamData[msg.author.id] = msg.createdTimestamp;
		
	}else{
	
		AntySpamData[msg.author.id] = msg.createdTimestamp;
	
	}
	
if (!Command.startsWith(prefix) && !Command.startsWith('t!') && !Command.startsWith('t@')){ 
          let Data = null;  
       /* client.query('SELECT * FROM Poziomy WHERE UserId='+msg.author.id+';'), (err,res) => { console.log('ok');
		console.log(res);
  		if (res===null){
			client.query(`INSERT INTO Poziomy (UserID, MSG, LVL) VALUES (${msg.author.id}, 0,0);`, (err) => {
			if (err) throw err; return; 
			Data.msg = 0; 
			Data.lvl=0; console.log('Utworzono dane');
			
			});
			 
		}else{
		 for (let row of res.rows) {
    				console.log(JSON.stringify(row));
				  Data = JSON.stringify(row);
  			}
		}

	};*/
	
 	 const query = {
          // give the query a unique name
            name: 'fetch-user',
            text: 'SELECT * FROM Poziomy WHERE UserId = $1',
            values: [msg.author.id]
          };

// callback
client.query(query, (err, res) => {
	
  if (err || !res.rows[0]) {
	  const text = 'INSERT INTO Poziomy(UserId,MSG,LVL) VALUES($1, $2, $3) RETURNING *'
          const values =[msg.author.id,0,0];

          // callback
          client.query(text, values, (err, res) => {
             if (err) {
              console.log(err.stack);
             } else {
               
		    Data = res.rows[0];
		     addXP();
                // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
             }
})
  } else {

	  Data = res.rows[0];
	  addXP();
  }
})
function addXP(){		
        db.add(`Wiadomosci_${msg.author.id + msg.guild.id}`, 1).then(i => { 	
	 if(Data === null) return; if(Data === undefined) return;
		
           Data.msg = parseInt(Data.msg) + 1;
	const text = 'UPDATE Poziomy SET msg = ($1) WHERE UserId = ($2)'; const Values = [Data.msg,msg.author.id];
	   client.query(text,Values, (err) =>{ 
		   if (err)  console.log(err.stack);
	   });
		i=Data.msg;
            let messages; 
           Poziomy.forEach(function(value){
	   if(i === value) messages = value;
	   });

            if (!isNaN(messages)) { // If messages IS STILL empty, run this.
                db.add(`userLevel_${msg.author.id + msg.guild.id}`, 1).then(o => {
			var NRG = false;
			o = Data.lvl; 
			Data.lvl = Data.lvl + 1;
			const text = 'UPDATE Poziomy SET lvl = ($1) WHERE UserId = ($2)'; const Values = [Data.lvl,msg.author.id];
	                        client.query(text,Values, (err) =>{ 
		                 if (err)  console.log(err.stack);
	                        });
			
		    MINroles.forEach(function(value,index){
			  
		    	if(Data.lvl === value){
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
			 msg.reply(`Właśnie osiągnąłeś/aś ${Data.lvl} poziom w pisaniu i otrzymałeś/aś nowy tytuł!`); // Send their updated level to the channel.
			}else{
			 msg.reply(`Właśnie osiągnąłeś/aś ${Data.lvl} poziom w pisaniu!`); // Send their updated level to the channel.
			}
                   
                })
            }

        })} 
		
		
	return;}
	
	if(Command === `${prefix}poziom`){
		
		const query = {
                   // give the query a unique name
                  name: 'get-user-info',
                  text: 'SELECT * FROM Poziomy WHERE UserId = $1',
                  values: [msg.author.id]
                };

	
			
			client.query(query, (err, res) => {	
				if(err) return msg.reply(`Nie wysłałeś/aś żadnej wiadomości. Komendy się nie liczą do wiadomości`); 
				var Data = res.rows[0];	
		
				msg.reply(`Aktualnie posiadasz poziom `+Data.lvl+`. `+Data.msg+`/`+Poziomy[Data.lvl]+` do następnego poziomu.`);
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

bot.on("guildMemberRemove", async member => {

	var UID = member.user.id;
	const query = {
                   // give the query a unique name
                  name: 'delete-user',
                  text: 'DELETE FROM Poziomy WHERE UserId = $1',
                  values: [UID]
                };
	client.query(query, (err) => {
		if (err) console.log(err);
	});

})

bot.login(process.env.BOT_TOKEN);
