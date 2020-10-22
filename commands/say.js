module.exports ={
    name: "say", 
    description: "Makes the bot say whatever",
    execute(client, message, args){
        var text = message.content.split(' ').slice(1).join(' ');
        if(!text) return;
        if(message.author.id !== "286770288396337163") {
            return;
        }
        message.channel.send(`${text}`);
        message.delete();
        message.channel.stopTyping()
    }
};  
