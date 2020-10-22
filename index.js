const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const { Client, MessageEmbed } = require('discord.js');
const TOKEN = ''; // Enter your own token here.
const raw = fs.readFileSync('patterns.json');
const chanceToAdd = 0.1; // Determines the chance for the bot to add a message to the JSON file (.5 = 50% chance).
const chanceToRespond = 0.2; // Determines the chance for the bot to respond to a message (.2 = 20% chance).
const pingChance = 0.2; // Determines the chance for the bot to ping the user it is replying to (.3 = 30% chance).
const replyFactor = 21000; // Determines the time it'll take to reply in Milliseconds.
const learnChannelBL = []; // Nazya will not respond or talk in any of the channels in the array.
const sendChannelBL = []; // Nazya will not learn any words from the channels in the array.
const wordsToFilter = [ "say" ]; // Any word within the array is filtered by Nazya.
let patterns = JSON.parse(raw); // Clarifying a pttern from the patterns.json file.
let queue = 1; // Amount of messages allowed to be queued at a time. AVOID 0 FOR MESSAGE SPAM.

client.commands = new Discord.Collection(); // Connecting the bots code with the commands in the commands folder.
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

// Calculates the chance of adding a speech pattern to the JSON file (default is a 50/50 chance)
const addChance = () => {
    return Math.random() < chanceToAdd;
};

// Calculates the chance of responding to a user (default is a 20% chance)
const respondChance = () => {
    return Math.random() < chanceToRespond;
};

// Calculates how long the bot will be typing for
const getReplyTime = () => {
    let time = Math.floor(Math.random() * replyFactor);
    if (time < 3500) {
        return time * 5;
    } else {
        return time;
    }

};

// Sends a random message from the speech patterns JSON file and clears a spot in the message queue
const sendRand = (message) => {
    message.channel.send(patterns.speechPatterns[Math.floor(Math.random() *
        patterns.speechPatterns.length)]).catch(() => {});
    queue--;
    message.channel.stopTyping();
};


// Checks against filters and automatically filters spam
const filterMessages = (message) => {
    if (message.content.includes('http') || message.content.includes(
            '\n') || message.content.includes('discord.gg') || learnChannelBL.includes(message.channel.id )) return '';
    speech = message.content.replace(/[!<@>\d]/g,
    ''); //Removes all mentions of a user before adding the speech pattern to the JSON file
    speech = speech.replace(/:\w*:/g, ''); //removes any emotes
    for (let i = 0; i < wordsToFilter.length; i++) {
        if (speech.toLowerCase().includes(wordsToFilter[i])) return ''; //c: popsicle
    };
    return speech;
};

// Checks if a message is being added to the JSON file
const writeMessages = (speech) => {
    if (addChance()) {
        if (speech.length === 0) return; //c: popsicle
        for (let i = 0; i < patterns.speechPatterns.length; i++) {
            if (patterns.speechPatterns[i] == speech) return;
        };
        patterns.speechPatterns.push(speech);
        fs.writeFile('patterns.json', JSON.stringify(patterns), () => {});
    }
};

// Determines if and how the bot will reply to a message
const replyMessages = (message, speech) => {
    if (sendChannelBL.includes(message.channel.id)) return;
    let name = client.user.username.toLowerCase();
    if (respondChance() && !message.content.toLowerCase().includes(name) &&
        !message.content.includes(client.user.id)) {
        //this for loop is used for finding common speech patterns from a user message (will make the bot seem human)
        common = commonFound(message);
        if (common != null) {
            message.channel.stopTyping();
            setTimeout(() => {
                message.channel.startTyping()
            }, Math.random() * 7000);
            queue++;
            setTimeout(() => {
                message.channel.send(common).catch(() => {});
                queue--
                message.channel.stopTyping();
            }, getReplyTime());
            return;
        } else {
            if (Math.random() <
                pingChance) { //The bot has a 50% chance of pinging the user of whose message it is responding to
                message.channel.stopTyping();
                setTimeout(() => {
                    message.channel.startTyping()
                }, Math.random() * 7000);
                queue++;
                setTimeout(() => {
                    message.channel.send(
                        `<@${message.author.id}> ${patterns.speechPatterns[Math.floor(Math.random() * patterns.speechPatterns.length)]}`
                        ).catch(() => {});
                    queue--;
                    message.channel.stopTyping();
                }, getReplyTime());
            } else {
                setTimeout(() => {
                    message.channel.startTyping()
                }, Math.random() * 7000);
                queue++;
                setTimeout(() => {
                    sendRand(message)
                }, getReplyTime());
            }
        }
    }
};

// Message filtering and managing.
const commonFound = (message) => {
    message.content = message.content.replace(/[!<@>\d]/g, ''); //Removes all mentions of a user
    message.content = message.content.replace(/:\w*:/g, ''); //removes any emotes
    let commonSpeech = null;
    for (let i = 0; i < patterns.speechPatterns.length; i++) {
        if (patterns.speechPatterns[i].includes(message.content) && patterns
            .speechPatterns[i] != message.content) {
            commonSpeech = patterns.speechPatterns[i];
            return commonSpeech;
        }
    };
};

// Ensuring that Nazya will reply to any message she is mentioned in.
// Additional Message filterting and managing.
const nameHeard = (message) => {
    if (sendChannelBL.includes(message.channel.id)) return;
    let name = client.user.username.toLowerCase();
    if (message.content.toLowerCase().includes(name) || message.content
        .includes(client.user.id)) { //If a stored speech pattern has similarities with the parsed message, send that speech pattern to make the bot seem more human
        common = commonFound(message);
        message.content = message.content.replace(/[]/g, ''); //Removes all mentions of a user
        message.content = message.content.replace(/:\w*:/g, ''); //removes any emotes
        if (common != null) {
            message.channel.stopTyping();
            setTimeout(() => {
                message.channel.startTyping()
            }, Math.random() * 7000);
            queue++;
            setTimeout(() => {
                message.channel.send(common).catch(() => {});
                queue--;
                message.channel.stopTyping();
            }, getReplyTime());
            return;
        } else {
            message.channel.stopTyping();
            setTimeout(() => {
                message.channel.startTyping()
            }, Math.random() * 7000);
            queue++;
            setTimeout(() => {
                sendRand(message)
            }, getReplyTime());
        }
    }
};

// Setting the bots presence as online and checking for any errors.
client.on('ready', () => {
    console.log(`AI Launch: ${client.user.tag}`);

    client.user.setPresence({
        status: "dnd",
    });

    client.user.setActivity("With your emotions", {
        type: "PLAYING",
    });
});

for(const file of commandFiles){
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command);
}

// The bots reaction to a new member joining the server.
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find(ch => ch.name === '►general');

    var options = ["Welcome to hell", "Leave now", "Newfaggot just joined", "Kys Newfag and leave", "imagine being so desperate you joined this server", "welcome new member", "hello"]
    var response = options[Math.floor(Math.random()*options.length)];

    if (!channel) return;
   
    channel.send(`${response} ${member}`);
});
// Checking for messages and assigning them the message variable
client.on('message', async message => {
    if (!message.channel.type == "dm") return;
    if (queue > 2) return;
    if (message.channel.type == "dm" || message.author.tag == client
        .user.tag || message.author.bot == true || message.content
        .length > 1200) {
        return message.channel.send;
    }
    speechPattern = filterMessages(message);
    writeMessages(speechPattern);
    replyMessages(message, speechPattern)
    nameHeard(message);
    
    // Responding with "no" if someone questions whether or not the bot is a bot.
    if (message.content.includes("nazya bot")) {
        var options = ["Yes I am totally a bot", "Beep Boop im a bot nigga.", "No I'm not actually a fucking bot you retard", "Do you really think I'm a bot?", "I'm pretty schizo but that doesn't mean I'm a bot"];
        var response = options[Math.floor(Math.random()*options.length)];
        try {
            setTimeout(() => {  message.channel.send(response); }, 5000);
        } catch (error) {
            console.error("You fucked up with your anti bot detect");
        }
}
// Assigning a 1 in 50 chance of the bot ringing the userphone and conversing with others.
let random = Math.floor(Math.random() * 50);
  if(random === 1) {
	await message.channel.send("!d bump")
  }
  else {
	return;

}
    const args = message.content.slice(message.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase ();

    if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);

    ///Error Message
    try{
        command.execute(client, message, args)
    }catch(error){
        console.error(error);
        message.reply("There was an issue.");
    }

});

client.login(TOKEN);
