const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "job=",
            memberName: "job=",
            aliases: [`joblist`],
            examples: [`${client.commandPrefix}job=`],
            description: "Shows all of the jobs currently.",
            group: "admin",
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            userPermissions: ["MANAGE_GUILD"]
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        this.client.db.findOne({guildID: message.guild.id}, async (err, db) => {
            if (db) {
                let jobdb;
                if(db.misc.jobs.length === 0){
                jobdb = await this.client.f.bin(`Default Jobs`, this.client.util.jobs.join('\n'))
                }else{
                jobdb = await this.client.f.bin(`Jobs`, db.misc.jobs.join('\n'))
                }
                let embed = new Discord.MessageEmbed()
                .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
                .setTimestamp()
                .setTitle(`Jobs List`)
                .setDescription(jobdb)
                return message.channel.send(embed)
            }else{
            return message.channel.send(`No Database yet.`)
            }
        });
        } catch (e) {
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}