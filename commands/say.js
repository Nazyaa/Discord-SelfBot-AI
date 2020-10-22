module.exports ={
    name: "say", 
    description: "Makes the bot say whatever",
    execute(client, message, args){
        var text = message.content.split(' ').slice(1).join(' ');
        if(!text) return;
        if(message.author.id !== "") { //ENTER YOUR I.D. THIS COMMAND CAN ONLY WORK FOR BOT OWNERS.
            return;
        }
        message.channel.send(`${text}`);
        message.delete();
        message.channel.stopTyping()
    }
};  
