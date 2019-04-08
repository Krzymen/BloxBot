const Discord = require('discord.js');
const client = new Discord.Client();

var RoleNames = 
{
    "robux":"Give me free R$!",
    "skrypt":"Skrypter",
    "🔨":"Budowniczy",
    "📰":"Ogłoszenia",
    "roblox":"Eventy"
}
client.on('ready',() => {
    console.log(`Zalogowano jako ${client.user.tag}`);
});

client.on('raw', event => {
    var EventName = event.t;

    if(EventName === 'MESSAGE_REACTION_ADD')
    {
        if(event.d.message_id === '564784035365126144')
        {
            var RC = client.channels.get(event.d.channel_id);
            if(RC.messages.has(event.d.message_id))
            {
                return
            }else
            {
                RC.fetchMessage(event.d.message_id).then(msg => {
                    var MsR = msg.reactions.get(event.d.emoji.name);
                    if(event.d.emoji.id)
                    {
                        MsR = msg.reactions.get(event.d.emoji.name + ":" + event.d.emoji.id);
                    }

                    var User = client.users.get(event.d.user_id);
                    client.emit("messageReactionAdd",MsR,User);
                }).catch(err => console.log(err));
            }
        }
    }else if(EventName === 'MESSAGE_REACTION_REMOVE')
    {
        if(event.d.message_id === '564784035365126144')
        {
            var RC = client.channels.get(event.d.channel_id);
            if(RC.messages.has(event.d.message_id))
            {
                return
            }else
            {
                RC.fetchMessage(event.d.message_id).then(msg => {
                    var MsR = msg.reactions.get(event.d.emoji.name);
                    if(event.d.emoji.id)
                    {
                        MsR = msg.reactions.get(event.d.emoji.name + ":" + event.d.emoji.id);
                    }

                    var User = client.users.get(event.d.user_id);
                    client.emit("messageReactionRemove",MsR,User);
                }).catch(err => console.log(err));
            }
        }
    }
});

client.on("messageReactionAdd",(MsR,User) => {
    var Role = MsR.message.guild.roles.find(role => role.name === RoleNames[MsR.emoji.name]);
    if(Role)
    {
        var Mebmer = MsR.message.guild.members.find(member => member.id === User.id);
        if(Mebmer)
        {
            if(!Mebmer.roles.find(role => role.id === Role.id)){
                Mebmer.addRole(Role.id);
            } 
        }
    }
});

client.on("messageReactionRemove",(MsR,User) => {
    var Role = MsR.message.guild.roles.find(role => role.name === RoleNames[MsR.emoji.name]);
    if(Role)
    {
        var Mebmer = MsR.message.guild.members.find(member => member.id === User.id);
        if(Mebmer)
        {
            if(Mebmer.roles.find(role => role.id === Role.id)){
                Mebmer.removeRole(Role.id);
            } 
        }
    }
});

client.login(process.env.BOT_TOKEN);
