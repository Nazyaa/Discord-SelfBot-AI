module.exports ={
    name: "bump", 
    description: "Makes Nazya Bump the server",
    execute(client, message, args){
        var options = ["Gotta bump man", "Doing gods work here.", "Remember to bump every two hours!", "We need members.", "I'm pretty dumb but at least I can do that lol"];
        var response = options[Math.floor(Math.random()*options.length)];
        
        if(message.author.id !== "286770288396337163") {
            return;
        }
        message.channel.send(`!d bump`);
        wait(3000);
        message.channel.send(response);
        message.channel.stopTyping()
    }
};  
